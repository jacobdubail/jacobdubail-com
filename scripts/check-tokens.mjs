/**
 * Verifies the colour claims in globals.css against the values it ships.
 *
 * The token block is load-bearing documentation: it tells a future reader
 * which token is safe on which surface, and the design was tuned against
 * those numbers. Three times now a value moved and its annotation did not,
 * so the table is derived here rather than maintained by hand.
 *
 *   node scripts/check-tokens.mjs          verify, exit non-zero on drift
 *   node scripts/check-tokens.mjs --print  print the table
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const CSS = join(dirname(fileURLToPath(import.meta.url)), '../src/app/(frontend)/globals.css')

/** Tokens carrying body-size text must clear this on every surface they sit on. */
const AA_BODY = 4.5
/** Marks, large type and object boundaries only need the non-text floor. */
const AA_LARGE = 3.0
/** Tokens exempt from AA_BODY because they are never set at body size. */
const LARGE_ONLY = new Set(['--c-orange', '--c-blue'])
/** Tokens that are surfaces or rules, not text. */
const NON_TEXT = new Set(['--c-bg', '--c-soft', '--c-line', '--c-line-strong'])

const srgb = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const rgb = (hex) => {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => srgb(parseInt(h.slice(i, i + 2), 16) / 255))
}
/** Two colours can share a luminance and still look nothing alike, so the
 *  "is this mistakable for a link" test has to be perceptual. */
const oklab = (hex) => {
  const [r, g, b] = rgb(hex)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}
const deltaE = (a, b) => {
  const [x, y, z] = oklab(a)
  const [p, q, r] = oklab(b)
  return Math.hypot(x - p, y - q, z - r)
}
const lum = (hex) => {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => srgb(parseInt(h.slice(i, i + 2), 16) / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
const r2 = (n) => Math.round(n * 100) / 100

const failures = []
const walkTsx = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? walkTsx(join(dir, e.name))
      : e.name.endsWith('.tsx')
        ? [join(dir, e.name)]
        : [],
  )
const css = readFileSync(CSS, 'utf8')
// Comment text with the block-comment asterisks and wrapping removed, so a
// Prettier reflow cannot break a check that is about the design.
const prose = css.replace(/^\s*\*/gm, ' ').replace(/\s+/g, ' ')
const block = (sentinel) => {
  const i = css.indexOf(sentinel)
  if (i === -1) {
    console.error(
      `\n  ✗ sentinel ${sentinel} not found in globals.css — the guard cannot locate the tokens\n`,
    )
    process.exit(1)
  }
  return css.slice(i, css.indexOf('\n}', i))
}
const tokens = (sel) => {
  const body = block(sel)
  const declared = [...body.matchAll(/(--c-[a-z0-9-]+):\s*([^;]+);/g)]
  const out = {}
  for (const [, k, raw] of declared) {
    const v = raw.trim()
    if (v.startsWith('var(')) continue // aliases such as --c-band resolve elsewhere
    if (!/^#[0-9a-f]{6}$/i.test(v))
      failures.push(
        `${sel.trim()} ${k} is "${v}" — tokens must be 6-digit hex so they can be checked`,
      )
    else out[k] = v.toLowerCase()
  }
  return out
}

const themes = { light: tokens('/* @tokens light */'), dark: tokens('/* @tokens dark */') }
const EXPECTED = [
  '--c-bg',
  '--c-fg',
  '--c-ink2',
  '--c-mute',
  '--c-faint',
  '--c-line',
  '--c-line-strong',
  '--c-soft',
  '--c-orange',
  '--c-orange-text',
  '--c-blue',
]
for (const [name, t] of Object.entries(themes)) {
  const missing = EXPECTED.filter((k) => !(k in t))
  if (missing.length)
    failures.push(`${name} is missing ${missing.join(', ')} — did the block move?`)
}
const rows = []

// A token that exists in one theme and not the other is a hole, not a choice.
for (const [a, b] of [
  ['light', 'dark'],
  ['dark', 'light'],
])
  for (const k of Object.keys(themes[a]))
    if (!(k in themes[b])) failures.push(`${k} is defined in ${a} but not in ${b}`)

for (const [theme, t] of Object.entries(themes)) {
  const { '--c-bg': bg, '--c-soft': soft } = t
  for (const [name, hex] of Object.entries(t)) {
    if (name === '--c-bg' || name === '--c-band') continue
    const onBg = ratio(hex, bg)
    const onSoft = ratio(hex, soft)
    rows.push({ theme, name, hex, onBg: r2(onBg), onSoft: r2(onSoft) })
    if (NON_TEXT.has(name)) {
      if (name === '--c-line-strong' && Math.min(onBg, onSoft) < AA_LARGE)
        failures.push(
          `${theme} ${name} is ${r2(Math.min(onBg, onSoft))} — object boundaries need ${AA_LARGE}`,
        )
      continue
    }
    const floor = LARGE_ONLY.has(name) ? AA_LARGE : AA_BODY
    if (Math.min(onBg, onSoft) < floor)
      failures.push(
        `${theme} ${name} is ${r2(Math.min(onBg, onSoft))} on its worst surface — needs ${floor}`,
      )
  }
  // The surface step and the rule weight should read the same in both themes.
  rows.push({ theme, name: 'soft-step', hex: soft, onBg: r2(ratio(soft, bg)), onSoft: 1 })
}

// The headline sets one word in each hue. If the two hues differ in
// lightness, the headline has a winning word — so the palette itself is
// tuned to equal OKLab L, which is the unit the eye actually works in.
// (A contrast-ratio tolerance tight enough to mean anything here is about
// 20x finer than a just-noticeable difference, which only teaches the next
// person to widen the threshold.)
for (const theme of ['light', 'dark']) {
  const t = themes[theme]
  const dL = Math.abs(oklab(t['--c-orange'])[0] - oklab(t['--c-blue'])[0])
  if (dL > 0.015)
    failures.push(
      `${theme} --c-orange and --c-blue differ by ${Math.round(dL * 1000) / 1000} in OKLab L — the headline would have a winning word`,
    )
  // Equal lightness is not enough: the more saturated of two equally light
  // colours still advances, so the headline gets a winning word anyway.
  const chroma = (h) => {
    const [, a, b] = oklab(h)
    return Math.hypot(a, b)
  }
  const CHROMA_TOLERANCE = 0.012
  const dC = Math.abs(chroma(t['--c-orange']) - chroma(t['--c-blue']))
  if (dC > CHROMA_TOLERANCE)
    failures.push(
      `${theme} --c-orange and --c-blue differ by ${Math.round(dC * 1000) / 1000} in OKLab chroma (limit ${CHROMA_TOLERANCE}) — the more saturated word advances`,
    )
  // The act-on-this pair is two values of one hue: a mark tier and a text
  // tier. Nothing stopped them converging into one.
  const tang = deltaE(t['--c-orange'], t['--c-orange-text'])
  if (tang < 0.02)
    failures.push(
      `${theme} --c-orange and --c-orange-text are ΔE ${r2(tang)} apart — the mark and text tiers have converged`,
    )
  // The two hues must also stay far enough apart to read as two hues.
  const sep = deltaE(t['--c-orange'], t['--c-blue'])
  if (sep < 0.15)
    failures.push(`${theme} --c-orange and --c-blue are only ΔE ${r2(sep)} apart — not two hues`)
}

// The ramp figures appear verbatim in the token comment. Printing them is
// not enough — they have to fail when they stop being true.
// Parsed out of the comment, so the SENTENCE is what is tested. Comparing
// against a literal in this file just moves the hand-maintained number from
// one place to another — the exact failure this script exists to end.
const rampClaim = (theme) => {
  const re =
    theme === 'light'
      ? /light's ink2\/mute\/faint sit ([\d.]+)x \/ ([\d.]+)x \/ ([\d.]+)x/
      : /dark's sit ([\d.]+)x \/ ([\d.]+)x \/ ([\d.]+)x/
  const m = prose.match(re)
  if (!m) {
    failures.push(`could not find the ${theme} neutral-ramp figures in the token comment`)
    return null
  }
  return m.slice(1, 4).map(Number)
}
const RAMP = { light: rampClaim('light'), dark: rampClaim('dark') }
for (const theme of ['light', 'dark']) {
  const t = themes[theme]
  const fg = ratio(t['--c-fg'], t['--c-bg'])
  const got = ['--c-ink2', '--c-mute', '--c-faint'].map((k) => fg / ratio(t[k], t['--c-bg']))
  if (!RAMP[theme]) continue
  got.forEach((v, i) => {
    if (Math.abs(v - RAMP[theme][i]) > 0.05)
      failures.push(
        `${theme} neutral ramp step ${i + 1} computes ${r2(v)}x, the token comment claims ${RAMP[theme][i]}x`,
      )
  })
}

// A raised surface and a hairline have to be VISIBLE, not merely equal
// across themes. Symmetry alone passes happily when both collapse to
// nothing, which is the failure that would actually show on screen.
// The comment promises dark --c-faint keeps headroom over the floor rather
// than sitting on it. Promised, therefore tested.
{
  const f = themes.dark['--c-faint']
  const onSoft = ratio(f, themes.dark['--c-soft'])
  if (onSoft < 4.6)
    failures.push(
      `dark --c-faint is ${r2(onSoft)} on --c-soft — the comment claims headroom over 4.5`,
    )
}

const softLight = ratio(themes.light['--c-soft'], themes.light['--c-bg'])
const softDark = ratio(themes.dark['--c-soft'], themes.dark['--c-bg'])
const lineLight = ratio(themes.light['--c-line'], themes.light['--c-bg'])
const lineDark = ratio(themes.dark['--c-line'], themes.dark['--c-bg'])
for (const [what, v, lo, hi] of [
  ['light surface step', softLight, 1.1, 1.35],
  ['dark surface step', softDark, 1.1, 1.35],
  ['light rule weight', lineLight, 1.18, 1.45],
  ['dark rule weight', lineDark, 1.18, 1.45],
])
  if (v < lo || v > hi)
    failures.push(
      `${what} is ${r2(v)} — must sit between ${lo} and ${hi} to read as a surface/rule`,
    )

// Structure should carry the same weight in both themes, so the rule match
// stays exact. The surface match does not: holding it exactly cost the
// light theme real text contrast (faint and mute both had to darken) to
// equalise a property nobody can perceive, since no one sees both themes
// at once. A shared range is the honest version of that rule.
if (Math.abs(lineLight - lineDark) > 0.03)
  failures.push(`rule weight differs across themes: light ${r2(lineLight)} vs dark ${r2(lineDark)}`)

// The vertical ramp's whole point is that the breaks can be ranked. Two
// roles sharing a value, or the ratio collapsing at the mobile step, both
// defeat it — and both have happened.
const MOBILE_AT = css.indexOf('@media (max-width: 599.98px)')
const gaps = (from, to) =>
  Object.fromEntries(
    [...css.slice(from, to).matchAll(/(--gap-[a-z-]+):\s*(\d+)px/g)].map(([, k, v]) => [
      k,
      Number(v),
    ]),
  )
const desktop = gaps(0, MOBILE_AT)
const mobile = gaps(MOBILE_AT, css.indexOf('/* ---', MOBILE_AT))
for (const [label, g] of [
  ['desktop', desktop],
  ['mobile', mobile],
]) {
  if (!Object.keys(g).length) continue
  const ratioSH = g['--gap-section'] / g['--gap-hero']
  if (ratioSH < 1.3)
    failures.push(
      `${label} --gap-section is only ${r2(ratioSH)}x --gap-hero — the largest break is not rankable`,
    )
  const page = ['--gap-chrome', '--gap-hero', '--gap-footer', '--gap-bottom']
  const vals = page.map((k) => g[k])
  if (new Set(vals).size !== vals.length)
    failures.push(
      `${label} page-level gaps tie: ${page.map((k, i) => `${k} ${vals[i]}`).join(', ')}`,
    )
  if (g['--gap-footer'] > g['--gap-hero'])
    failures.push(
      `${label} --gap-footer (${g['--gap-footer']}) outranks --gap-hero (${g['--gap-hero']})`,
    )
  // The article ramp is the newer and less settled of the two and had no
  // coverage at all; it has to descend, strictly.
  const art = ['--gap-art-lead', '--gap-art-body', '--gap-art-block', '--gap-art-tight']
  const av = art.map((k) => g[k])
  if (av.every((v) => v !== undefined))
    for (let i = 1; i < av.length; i++)
      if (av[i] >= av[i - 1])
        failures.push(
          `${label} ${art[i]} (${av[i]}) does not sit below ${art[i - 1]} (${av[i - 1]}) — the article ramp must descend`,
        )
}

// --- Every family the stylesheet asks for is actually loaded -------------
// `--font-sans: var(--font-inter)` after the layout stopped defining
// `--font-inter` does not throw, does not warn, and does not fail a build.
// The var resolves to nothing, the fallback after the comma takes over, and
// the whole site quietly renders in system-ui. Renaming the variable on one
// side of that pair is exactly the kind of edit a font swap invites, so the
// two sides are checked against each other, and against the disk.
const LAYOUT = join(dirname(fileURLToPath(import.meta.url)), '../src/app/(frontend)/layout.tsx')
const layout = readFileSync(LAYOUT, 'utf8')
// One regex, so a family's binding, variable and src stay attached to each
// other. Matching them separately pairs every variable with the first const
// in the file.
const declared = new Map(
  [...layout.matchAll(/const (\w+) = localFont\(\{([^}]*)\}\)/g)].flatMap(([, binding, body]) => {
    const name = body.match(/variable:\s*'([^']+)'/)?.[1]
    const src = body.match(/src:\s*'([^']+)'/)?.[1]
    return name ? [[name, { binding, src }]] : []
  }),
)
for (const [, fam] of css.matchAll(/--font-(?:sans|serif|mono):\s*var\((--font-[\w-]+)\)/g)) {
  if (!declared.has(fam))
    failures.push(
      `globals.css asks for ${fam}, but no localFont() in layout.tsx defines it — the family silently falls back`,
    )
}
for (const [name, { binding, src }] of declared) {
  if (!src) {
    failures.push(`${name} is declared in layout.tsx with no src`)
  } else if (!existsSync(join(dirname(LAYOUT), src))) {
    failures.push(`${name} points at ${src}, which is not on disk`)
  }
  // A family nobody puts on <html> is a file served for nothing.
  if (!new RegExp(`\\$\\{${binding}\\.variable\\}`).test(layout))
    failures.push(`${name} is defined but never put on <html> — nothing can use it`)
}

// --- Letterspaced caps inside a border pay the trailing space back -------
// CSS adds letter-spacing after the final character as well as between
// characters, so a letterspaced word centred in a padded box is not centred:
// it leans left by exactly one tracking unit. Nothing warns about it and it
// survives a font swap untouched, because the offset is em-relative. Any
// rule that letterspaces uppercase text inside its own padding has to give
// that unit back on the right.
const TRACK_FLOOR = 0.03 // em; below this the lean is under 0.4px at 12px
// Non-zero horizontal padding, from either shorthand or longhand. `padding:
// 15px 0` is not a box a word can lean inside of, so it does not count.
const hPad = (body) => {
  const long = [...body.matchAll(/padding-(?:right|left|inline(?:-\w+)?):\s*([^;]+)/g)]
  if (long.some(([, v]) => parseFloat(v) > 0)) return true
  const short = body.match(/(?:^|[;{\s])padding:\s*([^;]+)/)
  if (!short) return false
  const parts = short[1].trim().split(/\s+/)
  const horiz = parts.length === 1 ? [parts[0]] : [parts[1], parts[3] ?? parts[1]]
  return horiz.some((v) => parseFloat(v) > 0)
}
// A class can get its box from a base class it is layered onto — .chip-state
// is padded by .chip and declares no padding of its own. Checking only the
// rule's own body let exactly that case through.
const padded = new Set()
for (const [, sel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g))
  if (hPad(body)) for (const [, c] of sel.matchAll(/\.([\w-]+)/g)) padded.add(c)
const inABox = (sel, body) => {
  if (hPad(body)) return true
  for (const [, c] of sel.matchAll(/\.([\w-]+)/g)) {
    if (padded.has(c)) return true
    // .chip-state -> .chip
    for (let i = c.lastIndexOf('-'); i > 0; i = c.lastIndexOf('-', i - 1))
      if (padded.has(c.slice(0, i))) return true
  }
  return false
}
for (const [, sel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  if (!/text-transform:\s*uppercase/.test(body)) continue
  const ls = body.match(/letter-spacing:\s*([\d.]+)em/)
  if (!ls || Number(ls[1]) < TRACK_FLOOR) continue
  if (!inABox(sel, body)) continue
  if (new RegExp(`padding-right:\\s*calc\\([^)]*-\\s*${ls[1]}em`).test(body)) continue
  const name = sel.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim()
  failures.push(
    `${name} letterspaces uppercase at ${ls[1]}em inside a padded box but never gives the trailing space back — it leans left`,
  )
}

// --- Type scale ---------------------------------------------------------
// The scale comment was wrong in three places two rounds ago and is right
// now only because it was fixed by hand. This is the same treatment the
// gaps already get.
const SCALE_ORDER = ['xs', 'sm', 'ui', 'base', 'md', 'lg', 'xl', '2xl', 'display']
// Off the rank ladder on purpose. --text-code is an optical correction for a
// different typeface at the same rank as body, not a rank of its own, so the
// adjacent-step rule does not apply to it. Anything else unlisted is an error.
const OFF_LADDER = new Set(['code'])
const scale = {}
for (const [, name, val] of css.matchAll(/--text-([a-z0-9]+):\s*([^;]+);/g)) {
  if (name.includes('--')) continue // skip --text-sm--letter-spacing and friends
  const clamp = val.match(/clamp\(\s*([\d.]+)px[^,]*,[^,]*,\s*([\d.]+)px/)
  const flat = val.match(/^([\d.]+)px$/)
  if (clamp) scale[name] = { min: Number(clamp[1]), max: Number(clamp[2]) }
  else if (flat) scale[name] = { min: Number(flat[1]), max: Number(flat[1]) }
}
// A step the list does not know about is dropped from every check below,
// which is the same vacuous pass EXPECTED already closes for colour.
for (const k of Object.keys(scale))
  if (!SCALE_ORDER.includes(k) && !OFF_LADDER.has(k))
    failures.push(`--text-${k} is not in SCALE_ORDER — it would skip every scale check`)
// An off-ladder step still has to stay inside the ladder's range, or it is a
// rank in disguise.
for (const k of OFF_LADDER)
  if (k in scale && (scale[k].min < scale.xs.min || scale[k].max > scale.display.max))
    failures.push(`--text-${k} sits outside the scale's range`)

const present = SCALE_ORDER.filter((k) => k in scale)
// Every step must clear the one below it at BOTH ends of its clamp, or two
// steps collapse into one at some viewport — which is how prose h2 and h3
// ended up identical on every phone. 1.10x, not 1px: two steps a pixel
// apart are ordered but not separable.
const STEP = 1.1
for (let i = 1; i < present.length; i++) {
  const lo = scale[present[i - 1]]
  const hi = scale[present[i]]
  if (hi.min < lo.min * STEP)
    failures.push(
      `--text-${present[i]} floors at ${hi.min}px against --text-${present[i - 1]}'s ${lo.min}px (${r2(hi.min / lo.min)}x) — needs ${STEP}x to be separable on small screens`,
    )
  if (hi.max < lo.max * STEP)
    failures.push(
      `--text-${present[i]} caps at ${hi.max}px against --text-${present[i - 1]}'s ${lo.max}px (${r2(hi.max / lo.max)}x) — needs ${STEP}x`,
    )
}

// Endpoints alone cannot see the middle: two steps with different vw slopes
// can satisfy both endpoint comparisons and still converge between them.
// Sample the ratio across the range instead of trusting the ends.
const slopes = Object.fromEntries(
  [
    ...css.matchAll(
      /--text-([a-z0-9]+):\s*clamp\(\s*([\d.]+)px\s*,\s*([\d.]+)vw\s*,\s*([\d.]+)px/g,
    ),
  ].map(([, k, lo, vw, hi]) => [k, { lo: +lo, vw: +vw, hi: +hi }]),
)
const sizeAt = (k, vwPx) => {
  const c = slopes[k]
  if (!c) return scale[k].min
  return Math.min(Math.max(c.lo, (c.vw * vwPx) / 100), c.hi)
}
for (let i = 1; i < present.length; i++) {
  const [a, b] = [present[i - 1], present[i]]
  let worst = Infinity
  let at = 0
  for (let vw = 320; vw <= 1920; vw += 4) {
    const r = sizeAt(b, vw) / sizeAt(a, vw)
    if (r < worst) {
      worst = r
      at = vw
    }
  }
  if (worst < STEP - 0.001)
    failures.push(
      `--text-${b} falls to ${r2(worst)}x of --text-${a} at ${at}px wide — under the ${STEP}x floor, between the clamp endpoints`,
    )
}

// All nine compared, not the four that happen to be clamped: moving
// --text-base to 18px while the comment still read "base 17" used to pass.
const claimed = prose.match(
  /xs ([\d.-]+) · sm ([\d.-]+) · ui ([\d.-]+) · base ([\d.-]+) · md ([\d.-]+) · lg ([\d.-]+) · xl ([\d.-]+) · 2xl ([\d.-]+) · display ([\d.-]+)/,
)
if (!claimed) failures.push('could not find the type-scale index in the globals.css comment')
else
  SCALE_ORDER.forEach((k, i) => {
    if (!(k in scale)) return failures.push(`--text-${k} is in the comment but not defined`)
    const say =
      scale[k].min === scale[k].max ? `${scale[k].min}` : `${scale[k].min}-${scale[k].max}`
    if (claimed[i + 1] !== say)
      failures.push(`scale comment says ${k} ${claimed[i + 1]}, tokens say ${say}`)
  })

// --- Chevron scale -------------------------------------------------------
// The comment says the mask is 3:5 and "every size keeps that". Three
// rounds were spent removing off-scale chevrons; this stops a fourth.
const chev = Object.fromEntries(
  [...css.matchAll(/--chev-(sm|md|lg)-([wh]):\s*(\d+)px/g)].map(([, size, axis, v]) => [
    `${size}-${axis}`,
    Number(v),
  ]),
)
for (const size of ['sm', 'md', 'lg']) {
  const w = chev[`${size}-w`]
  const h = chev[`${size}-h`]
  if (w === undefined || h === undefined) {
    failures.push(`--chev-${size}-w/h is missing`)
    continue
  }
  if (Math.abs(w / h - 0.6) > 0.04)
    failures.push(
      `--chev-${size} is ${w}x${h} (${r2(w / h)}) — the mask is 3:5, so every size must be 0.6`,
    )
}

// --- Chevron usage -------------------------------------------------------
// The ratio check validates the tokens; this stops a component reaching
// past them, which is how three off-scale chevrons survived three rounds.
for (const file of (function walkOnce(d) {
  return readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walkOnce(join(d, e.name)) : e.name.endsWith('.tsx') ? [join(d, e.name)] : [],
  )
})(join(dirname(fileURLToPath(import.meta.url)), '../src'))) {
  const body = readFileSync(file, 'utf8')
  for (const [, cls] of body.matchAll(/className="([^"]*\bchev\b[^"]*)"/g))
    if (/\b[wh]-\[\d/.test(cls))
      failures.push(
        `${file.split('/src/')[1]} sizes a chevron with a literal — use --chev-sm/md/lg: "${cls}"`,
      )
}

// --- Inert em caps -------------------------------------------------------
// Shipped three times now: a max-width in `em` on an element whose own
// font-size is larger than the base, which computes wider than the column
// it was meant to cap and silently does nothing.
for (const [, selector, body] of css.matchAll(/([^\n{}]+)\{([^{}]*)\}/g)) {
  const cap = body.match(/max-width:\s*([\d.]+)em/)
  const fs = body.match(/font-size:\s*var\(--text-([a-z0-9]+)\)/)
  if (!cap || !fs) continue
  const step = scale[fs[1]]
  if (step && step.min > 17 && Number(cap[1]) * step.min > 600)
    failures.push(
      `${selector.trim()} caps at ${cap[1]}em of ${step.min}px = ${Math.round(Number(cap[1]) * step.min)}px — wider than any column here, so it never binds`,
    )
}

// --- One shape, one source ------------------------------------------------
// The chevron and the arrow each exist twice: as an SVG path a component
// draws, and as a CSS mask. Two copies of one shape is the drift this file
// spends its time preventing, so the copies are held equal.
{
  const icons = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../src/components/icons.tsx'),
    'utf8',
  )
  const konst = (name) => (icons.match(new RegExp(`${name}\\s*=\\s*\\n?\\s*'([^']+)'`)) || [])[1]
  const mask = (name) => (css.match(new RegExp(`--${name}:[^;]*d='([^']+)'`)) || [])[1]
  const pairs = [
    ['chev', [konst('CHEV_UPPER'), konst('CHEV_LOWER')].join('')],
    ['arrow', konst('ARROW_PATH')],
  ]
  for (const [name, fromTsx] of pairs) {
    const fromCss = mask(name)
    if (!fromTsx || !fromCss)
      failures.push(`could not read both copies of the ${name} path to compare them`)
    else if (fromTsx !== fromCss)
      failures.push(
        `--${name}'s mask and the path icons.tsx draws have diverged — one shape, one source`,
      )
  }
}

// --- Every class a component emits has a rule ----------------------------
// PageHeader shipped .page-header-marked and .page-mark with no CSS behind
// them at all. Nothing rendered them at the time, so nothing caught it; the
// first uploaded portrait would have dropped an unstyled block in and
// shifted the h1 144px off the one left edge the layout is built on.
{
  const OURS =
    /^(page|index|entry|chip|prose|chev|tap|ext|band|article|scissor|headline|spans|name)(-|$)/
  const srcRoot = join(dirname(fileURLToPath(import.meta.url)), '../src')
  const seen = new Set()
  for (const file of walkTsx(srcRoot))
    for (const [, attr] of readFileSync(file, 'utf8').matchAll(/className=[`"]([^`"]*)[`"]/g))
      for (const raw of attr.split(/\s+/)) {
        const cls = raw.split(':').pop()
        if (!cls || cls.includes('[') || cls.includes('{') || !OURS.test(cls)) continue
        if (seen.has(cls)) continue
        seen.add(cls)
        if (!new RegExp(`\\.${cls}(?![\\w-])`).test(css))
          failures.push(
            `${file.split('/src/')[1]} emits "${cls}", which no rule in globals.css selects`,
          )
      }
}

// --- One paragraph rhythm per page ---------------------------------------
// About's opening sentence comes from its own CMS field and so renders
// outside the rich text. Two paragraph streams on one page that are
// almost but not quite aligned read worse than two that obviously differ.
{
  const lh = (sel) => {
    const m = css.match(new RegExp(`\\n  \\${sel}\\s*\\{([^{}]*)\\}`))
    return m && m[1].match(/line-height:\s*([\d.]+)/)?.[1]
  }
  const a = lh('.prose')
  const b = lh('.prose-lead')
  if (!a || !b) failures.push('could not read line-height from .prose and .prose-lead')
  else if (a !== b)
    failures.push(
      `.prose-lead is ${b} against .prose's ${a} — a lead paragraph outside the rich text has to keep its rhythm`,
    )
}

// --- The gutter channel --------------------------------------------------
// The hover arrow hangs in the gap between the label column and the rows.
// It shipped 4px wider than that gap, so on the FIRST row of every list it
// crossed into the label column and overlapped the label's own chevron:
// two orange marks welded into one. The gap is now sized by the arrow, and
// the arrow has to prove it still fits.
{
  const gap = Number((css.match(/--label-gap:\s*(\d+)px/) || [])[1])
  if (!gap) failures.push('--label-gap is missing, so the hover channel cannot be checked')
  const baseW = Number((css.match(/\.entry-lead\s*\{[^{}]*width:\s*(\d+)px/) || [])[1])
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!selector.includes('.entry-lead')) continue
    const named = selector
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim()
      .replace(/\s+/g, ' ')
    const left = body.match(/left:\s*(-?[\d.]+)px/)
    if (!left) continue
    const w = Number((body.match(/width:\s*(\d+)px/) || [, baseW])[1])
    const hang = Math.abs(Number(left[1]))
    if (gap && hang > gap)
      failures.push(
        `${named} hangs ${hang}px into a ${gap}px channel — it reaches past the label column's edge and collides with the label's mark`,
      )
    if (w && hang < w)
      failures.push(
        `${named} hangs ${hang}px with a ${w}px mark — the mark's right edge lands inside the row's own text`,
      )
  }
}

// --- Index sections always cost something --------------------------------
// About shipped welded to the paragraph above it: its section followed a
// prose block rather than a page header, matched no adjacency rule, and so
// fell through to a margin of zero. A missing rule should cost too much
// space, never none.
{
  const base = css.match(/\n  \.index-section\s*\{([^{}]*)\}/)
  const mt = base && base[1].match(/margin-top:\s*var\(--(gap-[a-z-]+)\)/)
  if (!base) failures.push('could not find the base .index-section rule')
  else if (!mt)
    failures.push(
      '.index-section declares no default margin-top — a section that matches no adjacency rule would sit at zero',
    )
}

// --- Usage ---------------------------------------------------------------
// The token block says --c-blue is "never body text". Saying it is not the
// same as it being true, and the colour is only safe at the 3:1 tier.
// --c-orange is deliberately not checked the same way: it legitimately
// colours marks all over the stylesheet, and a rule good enough to tell a
// mark from a label would need to understand the selector, not grep it.
const BLUE_OK = new Set(['.headline-a'])
for (const [, selector] of css.matchAll(/([^\n{}]+)\{[^{}]*color:\s*var\(--c-blue\)[^{}]*\}/g)) {
  const name = selector.trim().split(/\s+/).pop()
  if (!BLUE_OK.has(name))
    failures.push(
      `--c-blue is used as a text colour on "${selector.trim()}" — it only clears the 3:1 tier`,
    )
}
const srcDir = join(dirname(fileURLToPath(import.meta.url)), '../src')
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.tsx') ? [join(dir, e.name)] : [],
  )
for (const file of walk(srcDir)) {
  const body = readFileSync(file, 'utf8')
  if (/\btext-blue\b/.test(body))
    failures.push(`${file.split('/src/')[1]} uses text-blue — azure is not a text colour`)
  // About set its opening paragraph at --text-md in --c-mute: two steps
  // lighter than the body it introduced, which inverts the hierarchy and
  // makes the page's first sentence read as a pulled quotation.
  for (const [, cls] of body.matchAll(/className="([^"]*)"/g))
    if (/\btext-md\b/.test(cls) && /\btext-mute\b/.test(cls))
      failures.push(
        `${file.split('/src/')[1]} sets a 19px deck in --c-mute — a deck lighter than the body it introduces reads as a quotation: "${cls}"`,
      )
}

if (process.argv.includes('--print')) {
  for (const theme of ['light', 'dark']) {
    console.log(`\n${theme}  (bg ${themes[theme]['--c-bg']}, soft ${themes[theme]['--c-soft']})`)
    for (const r of rows.filter((x) => x.theme === theme && x.name !== 'soft-step'))
      console.log(
        `  ${r.name.padEnd(16)} ${r.hex}   ${String(r.onBg).padStart(6)} on bg   ${String(r.onSoft).padStart(6)} on soft`,
      )
  }
  console.log(`\nsurface step   light ${r2(softLight)}   dark ${r2(softDark)}`)
  console.log(`rule weight    light ${r2(lineLight)}   dark ${r2(lineDark)}`)
  const iv = (theme) => {
    const t = themes[theme]
    const f = ratio(t['--c-fg'], t['--c-bg'])
    return ['--c-ink2', '--c-mute', '--c-faint']
      .map((k) => `${r2(f / ratio(t[k], t['--c-bg']))}x`)
      .join(' / ')
  }
  console.log(`neutral ramp   light ${iv('light')}   dark ${iv('dark')}`)
  console.log(
    `gap ranking    desktop ${r2(desktop['--gap-section'] / desktop['--gap-hero'])}x   mobile ${r2(mobile['--gap-section'] / mobile['--gap-hero'])}x`,
  )
  console.log(
    `type scale     ${present.map((k) => `${k} ${scale[k].min === scale[k].max ? scale[k].min : scale[k].min + '-' + scale[k].max}`).join(' · ')}`,
  )
}

if (failures.length) {
  console.error('\nToken drift:\n' + failures.map((f) => '  ✗ ' + f).join('\n') + '\n')
  process.exit(1)
}
console.log('\n✓ every token claim in globals.css holds\n')
