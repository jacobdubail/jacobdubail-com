import { Headline } from '@/components/Headline'
import { IndexSection } from '@/components/IndexSection'
import { PageHeader } from '@/components/PageHeader'
import { WorkRow } from '@/components/WorkRow'
import { card } from '@/content/card'

/**
 * The whole public site: a card.
 *
 * It is built out of the pieces the index pages used — the same header,
 * the same margin-index section, the same two-column block About's "Now"
 * list uses — so the page reads as a smaller version of the site rather
 * than a different one. Nothing here is a new layout idea, which is what
 * makes bringing the lists back a matter of restoring routes.
 *
 * No Payload read, so this route prerenders with no database.
 */
export default function HomePage() {
  const [lead, ...rest] = card.bio

  return (
    <>
      <PageHeader
        title={
          <Headline text={card.headline} blue={card.highlightBlue} orange={card.highlightOrange} />
        }
        intro={card.intro}
      />

      {/* Same shape as About's body: the opening sentence is the first
          paragraph, not a second deck. A lighter, looser line above
          darker body copy reads as a pulled quotation, and the page
          already has its deck above. */}
      <div className="index-offset mt-[var(--gap-art-block)]">
        {lead ? <p className="prose-lead">{lead}</p> : null}
        {rest.length ? (
          <div className="prose">
            {rest.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        ) : null}
      </div>

      {card.work.length ? (
        /* First section after the bio, so it takes the `lead` break; the
           two below it are `group`, which is the smaller one. The order
           is the argument: what I built, how this page is built, how to
           reach me. */
        <IndexSection label="Selected work" group lead>
          {card.work.map((w) => (
            <WorkRow
              key={w.title}
              title={w.title}
              meta={w.meta}
              description={w.description}
              href={w.href}
            />
          ))}
        </IndexSection>
      ) : null}

      {card.contact.length ? (
        <IndexSection label="Contact" group>
          <dl className="grid grid-cols-[var(--label-w)_minmax(0,1fr)] gap-x-[var(--label-gap)] gap-y-3 pt-4">
            {card.contact.map((r) => (
              <div key={r.label} className="contents">
                <dt className="pt-0.5 text-sm text-faint">{r.label}</dt>
                <dd className="leading-[1.55]">
                  {/* Every row is a profile of the same person, which is
                      what rel="me" is for. */}
                  <a href={r.href} className="ext ext-link" rel="me">
                    {r.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
          {/* Outside the <dl>, because a <p> is not a permitted child of
              one, and indented by the same --gutter the dl's own label
              column spends — so the note starts on the values' left edge
              at every width rather than in the label channel. */}
          {card.contactNote ? (
            <p className="mt-4 ml-[var(--gutter)] text-sm text-pretty text-faint">
              {card.contactNote}
            </p>
          ) : null}
        </IndexSection>
      ) : null}
      {card.site ? (
        /* Last, and quiet. See the note in card.ts: as a table above
           Contact this read as a skills list rather than as a sentence
           about the page you are looking at. */
        <IndexSection label="This site" group>
          <p className="pt-4 text-sm leading-[1.6] text-pretty text-mute">{card.site}</p>
        </IndexSection>
      ) : null}
    </>
  )
}
