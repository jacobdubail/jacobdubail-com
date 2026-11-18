import { splitHeadline } from '@/lib/headline'

/**
 * Renders the hero headline with one word in azure and one in tangerine.
 *
 * The two hues come straight from the palette. The headline is display use
 * of the brand's colours rather than a third meaning, and the pair is tuned
 * to equal OKLab lightness AND chroma so neither word out-shouts the other.
 *
 * The classes, rather than colours, are the point: .headline-a and
 * .headline-b resolve to --c-sys and --c-act, so the two words trade
 * hues with the theme the way every other accent on the page does.
 * See src/lib/headline.ts for where the split happens and why the
 * accent words are bound to the word before them.
 */
export function Headline({
  text,
  blue,
  orange,
}: {
  text: string
  blue?: string | null
  orange?: string | null
}) {
  return (
    <>
      {splitHeadline(text, blue, orange).map((run, i) =>
        run.accent ? (
          <span key={i} className={run.accent === 'a' ? 'headline-a' : 'headline-b'}>
            {run.text}
          </span>
        ) : (
          run.text
        ),
      )}
    </>
  )
}
