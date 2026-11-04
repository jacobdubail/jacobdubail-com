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
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const CSS = join(dirname(fileURLToPath(import.meta.url)), '../src/app/(frontend)/globals.css')

/** Tokens carrying body-size text must clear this on every surface they sit on. */
const AA_BODY = 4.5
/** Marks, large type and object boundaries only need the non-text floor. */
const AA_LARGE = 3.0
/** Tokens exempt from AA_BODY because they are never set at body size. */
const LARGE_ONLY = new Set(['--c-orange', '--c-head-a', '--c-head-b'])
/** Tokens that are surfaces or rules, not text. */
const NON_TEXT = new Set(['--c-bg', '--c-soft', '--c-line', '--c-line-strong'])

const srgb = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
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

const css = readFileSync(CSS, 'utf8')
const block = (sel) => {
  const i = css.indexOf(sel)
  return css.slice(i, css.indexOf('\n}', i))
}
const tokens = (sel) =>
  Object.fromEntries(
    [...block(sel).matchAll(/(--c-[a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map(([, k, v]) => [
      k,
      v.toLowerCase(),
    ]),
  )

const themes = { light: tokens(':root {'), dark: tokens('.dark {') }
const failures = []
const rows = []

for (const [theme, t] of Object.entries(themes)) {
  const { '--c-bg': bg, '--c-soft': soft } = t
  for (const [name, hex] of Object.entries(t)) {
    if (name === '--c-bg' || name === '--c-band') continue
    const onBg = ratio(hex, bg)
    const onSoft = ratio(hex, soft)
    rows.push({ theme, name, hex, onBg: r2(onBg), onSoft: r2(onSoft) })
    if (NON_TEXT.has(name)) {
      if (name === '--c-line-strong' && Math.min(onBg, onSoft) < AA_LARGE)
        failures.push(`${theme} ${name} is ${r2(Math.min(onBg, onSoft))} — object boundaries need ${AA_LARGE}`)
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

// The two headline accents must stay within 0.02 of each other, or the
// headline has a winning word.
for (const theme of ['light', 'dark']) {
  const t = themes[theme]
  const d = Math.abs(ratio(t['--c-head-a'], t['--c-bg']) - ratio(t['--c-head-b'], t['--c-bg']))
  if (d > 0.02) failures.push(`${theme} headline pair differs by ${r2(d)} — must be within 0.02`)
  // ...and head-b must not be mistakable for a link.
  const toLink = Math.abs(
    ratio(t['--c-head-b'], t['--c-bg']) - ratio(t['--c-orange-text'], t['--c-bg']),
  )
  if (toLink < 0.25)
    failures.push(
      `${theme} --c-head-b is within ${r2(toLink)} of --c-orange-text — the headline word reads as a link`,
    )
}

const softLight = ratio(themes.light['--c-soft'], themes.light['--c-bg'])
const softDark = ratio(themes.dark['--c-soft'], themes.dark['--c-bg'])
if (Math.abs(softLight - softDark) > 0.03)
  failures.push(
    `surface step differs across themes: light ${r2(softLight)} vs dark ${r2(softDark)}`,
  )

const lineLight = ratio(themes.light['--c-line'], themes.light['--c-bg'])
const lineDark = ratio(themes.dark['--c-line'], themes.dark['--c-bg'])
if (Math.abs(lineLight - lineDark) > 0.03)
  failures.push(`rule weight differs across themes: light ${r2(lineLight)} vs dark ${r2(lineDark)}`)

if (process.argv.includes('--print')) {
  for (const theme of ['light', 'dark']) {
    console.log(`\n${theme}  (bg ${themes[theme]['--c-bg']}, soft ${themes[theme]['--c-soft']})`)
    for (const r of rows.filter((x) => x.theme === theme && x.name !== 'soft-step'))
      console.log(`  ${r.name.padEnd(16)} ${r.hex}   ${String(r.onBg).padStart(6)} on bg   ${String(r.onSoft).padStart(6)} on soft`)
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
}

if (failures.length) {
  console.error('\nToken drift:\n' + failures.map((f) => '  ✗ ' + f).join('\n') + '\n')
  process.exit(1)
}
console.log('\n✓ every token claim in globals.css holds\n')
