import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { Headline } from '@/components/Headline'
import { PageHeader } from '@/components/PageHeader'
import { PageSection } from '@/components/PageSection'
import { WorkRow } from '@/components/WorkRow'
import { card } from '@/content/card'

/**
 * The whole public site: a card.
 *
 * Four blocks on one two-column grid — hero, work, the note about the
 * page, contact — and the order is the argument. What I claim, what I
 * built, how I think, how to reach me. Contact is last because it is
 * the thing a reader should be holding when they stop scrolling; the
 * letterhead carries the same route for the reader who never scrolls.
 *
 * The margin-index components the index routes used are untouched in
 * src/components and globals.css. This page does not import them.
 *
 * No Payload read, so this route prerenders with no database.
 */

/**
 * The portrait is optional and checked on disk, at build, rather than
 * trusted. A path in content that no file answers renders a broken
 * image on the one page a stranger judges you by, and nothing warns
 * about it: next/image would throw at request time, a bare <img> would
 * show the alt text in a 208px box. Checking here means the rail holds
 * either a portrait or nothing, and dropping a file into /public is the
 * whole of adding one.
 */
const portrait = card.portrait && existsSync(join(process.cwd(), 'public', card.portrait))

/** A fact with no value is a row nobody filled in, not a blank line. */
const facts = card.facts.filter((f) => f.value)

export default function HomePage() {
  return (
    <>
      <PageHeader
        title={
          <Headline text={card.headline} blue={card.highlightBlue} orange={card.highlightOrange} />
        }
        intro={card.intro}
        portrait={
          portrait ? (
            /* Plain <img>, not next/image: the source is a static file
               of a known size, the page prerenders with no loader, and
               an optimiser endpoint is a server round trip on a route
               whose entire claim is that it needs none. width/height
               are set so nothing reflows while it decodes. */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="portrait"
              src={card.portrait}
              alt={card.portraitAlt}
              width={208}
              height={208}
              decoding="async"
            />
          ) : null
        }
        facts={
          facts.length ? (
            <dl className="facts">
              {facts.map((f) => (
                <div key={f.term}>
                  <dt>{f.term}</dt>
                  {/* A list is one line per item. See card.ts: a middot
                      can only break after itself, so a wrapped value
                      leaves the separator hanging off the line end. */}
                  {(Array.isArray(f.value) ? f.value : [f.value]).map((v) => (
                    <dd key={v}>{v}</dd>
                  ))}
                </div>
              ))}
            </dl>
          ) : null
        }
      >
        {/* The bio, in the measure under the deck. One size, one colour
            — the deck above it is the step up. Three paragraphs at the
            same size as the sentence introducing them is the wall this
            page opened as, and a lead paragraph set larger than the
            deck was the over-correction. */}
        {card.bio.length ? (
          <div className="prose mt-7">
            {card.bio.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        ) : null}
      </PageHeader>

      {card.work.length ? (
        <PageSection label="Selected work" id="work">
          {card.work.map((w) => (
            <WorkRow
              key={w.title}
              title={w.title}
              meta={w.meta}
              description={w.description}
              emphasis={w.emphasis}
              href={w.href}
            />
          ))}
        </PageSection>
      ) : null}

      {card.site ? (
        /* Above Contact, not below it, and at body size. It spent the
           first round set in the smallest, faintest type on the page,
           last, under the contact block — and all three reviewers of
           that round independently called it the most distinctive thing
           here for an engineering reader. Burying your only
           differentiator in the fine print is a hierarchy decision, and
           it was the wrong one. */
        <PageSection label="This site" id="site">
          <div className="rail-row pt-5">
            <dl className="facts facts-flush">
              <div>
                <dt>{card.siteMeta.term}</dt>
                <dd>{card.siteMeta.value}</dd>
              </div>
            </dl>
            <p className="site-note">{card.site}</p>
          </div>
        </PageSection>
      ) : null}

      {card.contact.length ? (
        <PageSection label="Contact" id="contact">
          <dl className="pt-2">
            {card.contact.map((r) => (
              /* No per-row size tier any more — see the .contact-row
                 comment. Order and the letterhead carry the rank. */
              <div key={r.label} className="contact-row">
                <dt>{r.label}</dt>
                <dd>
                  {/* Every row is a profile of the same person, which
                      is what rel="me" is for. */}
                  <a href={r.href} className="ext ext-link" rel="me">
                    {r.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
          {card.contactNote ? <p className="contact-note rail-offset">{card.contactNote}</p> : null}
        </PageSection>
      ) : null}
    </>
  )
}
