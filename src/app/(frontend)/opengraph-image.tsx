import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { card } from '@/content/card'
import { splitHeadline, type HeadlineRun } from '@/lib/headline'
import { siteName } from '@/lib/site'

/**
 * The card that renders wherever someone pastes this link.
 *
 * Until now there was no og:image at all, so a link to this page
 * arrived in Slack, LinkedIn or iMessage as a title, a line of grey
 * text and a blank square — on a page whose entire job is to be sent
 * to someone. The preview is the first impression far more often than
 * the page is.
 *
 * It is generated rather than drawn, from the same card.ts the page
 * renders, so the headline in the preview cannot drift from the
 * headline on the site. It prerenders at build: a static PNG in the
 * output, not a function anyone pays for at request time.
 *
 * LIGHT THEME ONLY, and the colours are literals. Satori has no
 * cascade, no custom properties and no media queries, so the tokens
 * cannot reach it — these six values are copied from the :root block
 * in globals.css and will not follow it. That is the cost of the
 * feature. The check-tokens pass cannot see them either, so if the
 * palette moves, this file moves by hand.
 *
 * The fonts are pinned static subsets in src/fonts/og — Satori reads
 * ttf, otf and woff but not woff2, and it cannot drive a variable
 * axis. See src/fonts/README.md for how they are cut.
 */

/* From :root in globals.css. See the note above about why they are
   copies rather than references. */
const BG = '#fdfcfa'
const FG = '#17150f'
const MUTE = '#67625b'
const SOFT = '#f1ece3'
const LINE = '#dad4c8'
const ACT = '#c44e18' /* --c-act in light: the band, and "systems" */
const SYS = '#2c77da' /* --c-sys in light: "teams" */

/**
 * The headline, cut into the units that may not break.
 *
 * Satori has no inline layout: a box with more than one child has to
 * be a flex container, and a flex container breaks between its items
 * and nowhere else. So the words become the items. Splitting on the
 * ordinary space and never on the non-breaking one hands the card the
 * same line-break rule the page gets from the NBSP in the markup — the
 * accent word and the word before it arrive as one item and wrap
 * together, so neither colour opens a line here either.
 *
 * An item may hold more than one piece, because a bound pair spans the
 * boundary between plain text and an accent. "build teams" is one item
 * and two colours.
 */
type Piece = { text: string; accent: HeadlineRun['accent'] }

function tokenize(runs: HeadlineRun[]): Piece[][] {
  const tokens: Piece[][] = []
  let current: Piece[] = []
  for (const run of runs) {
    if (!run.text) continue
    run.text.split(' ').forEach((part, i) => {
      if (i > 0) {
        if (current.length) tokens.push(current)
        current = []
      }
      if (part) current.push({ text: part, accent: run.accent })
    })
  }
  if (current.length) tokens.push(current)
  return tokens
}

export const alt = `${card.headline} — ${siteName}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/* Read at module scope, not inside the handler, and the distinction is
   not style. Cache Components treats a route that performs an async
   filesystem operation as request-time work and stops prerendering it:
   with these four reads one line further down, the build emitted this
   card as a dynamic function and every scraper that ever touched the
   link would have paid Satori to draw it again. Hoisted here they run
   once at import, the route prerenders, and what ships is a PNG. The
   build output is where to check it — this route has to read (Static),
   not (Dynamic). */
const font = (file: string) => readFile(join(process.cwd(), 'src/fonts/og', file))

const [fraunces, franklin, franklinBold, portrait] = await Promise.all([
  font('Fraunces-400.ttf'),
  font('LibreFranklin-400.ttf'),
  font('LibreFranklin-600.ttf'),
  /* The same contract the Portrait component keeps: a card without a
     face beats a card with a broken one. */
  readFile(join(process.cwd(), 'public', 'portrait.jpg')).catch(() => null),
])

export default function OpenGraphImage() {
  const tokens = tokenize(splitHeadline(card.headline, card.highlightBlue, card.highlightOrange))
  const role = card.facts.find((f) => f.term === 'Role')?.value
  const roleLine = (Array.isArray(role) ? role.join(' · ') : role) ?? ''

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: BG,
        fontFamily: 'Libre Franklin',
      }}
    >
      {/* The band off the top of the page, at the page's own weight
            scaled to this canvas. It is the only thing a reader sees
            on both artefacts. */}
      <div style={{ display: 'flex', width: '100%', height: 10, backgroundColor: ACT }} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 72px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', width: 720 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              /* The space between words, set rather than typed: a
                   flex container trims the whitespace at an item's
                   edge, so the gap is the only space left. 14px is the
                   space advance of Fraunces at 54px. rowGap carries
                   the leading, which is why neither value is the
                   other. */
              columnGap: 14,
              rowGap: 8,
              fontFamily: 'Fraunces',
              fontSize: 54,
              lineHeight: 1.12,
              letterSpacing: '-0.022em',
              color: FG,
            }}
          >
            {tokens.map((pieces, i) => (
              <div key={i} style={{ display: 'flex' }}>
                {pieces.map((piece, j) => (
                  <span
                    key={j}
                    style={{
                      color: piece.accent === 'a' ? SYS : piece.accent === 'b' ? ACT : FG,
                    }}
                  >
                    {piece.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', marginTop: 34, fontSize: 25, color: MUTE }}>
            {roleLine}
          </div>
        </div>
        {portrait ? (
          <img
            /* Satori draws this into a PNG; there is no DOM, no
                 next/image and no alt text to read. The card's alt
                 text is the `alt` export above. */
            alt=""
            width={248}
            height={248}
            src={`data:image/jpeg;base64,${portrait.toString('base64')}`}
            style={{ borderRadius: 20, backgroundColor: SOFT, objectFit: 'cover' }}
          />
        ) : null}
      </div>
      {/* A hairline, the same job it does on the page: it gives the
            space under the headline an edge instead of leaving it to
            read as a card that ran short. */}
      <div style={{ display: 'flex', height: 1, margin: '0 72px', backgroundColor: LINE }} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '34px 72px 44px',
          fontSize: 24,
        }}
      >
        <div style={{ display: 'flex', fontWeight: 600, color: FG }}>{siteName}</div>
        <div style={{ display: 'flex', color: MUTE }}>jacobdubail.com</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 400, style: 'normal' },
        { name: 'Libre Franklin', data: franklin, weight: 400, style: 'normal' },
        { name: 'Libre Franklin', data: franklinBold, weight: 600, style: 'normal' },
      ],
    },
  )
}
