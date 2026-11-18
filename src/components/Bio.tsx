/**
 * The bio, in the measure under the deck.
 *
 * One size, one colour — the deck above it is the step up. Three
 * paragraphs at the same size as the sentence introducing them is the
 * wall this page opened as, and a lead paragraph set larger than the
 * deck was the over-correction.
 */
export function Bio({ paragraphs }: { paragraphs: readonly string[] }) {
  if (!paragraphs.length) return null

  return (
    <div className="prose mt-7">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 32)}>{p}</p>
      ))}
    </div>
  )
}
