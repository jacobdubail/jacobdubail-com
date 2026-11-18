import { Bio } from '@/components/Bio'
import { ContactList, ContactNote } from '@/components/ContactList'
import { Deck } from '@/components/Deck'
import { FactList } from '@/components/FactList'
import { Headline } from '@/components/Headline'
import { PageHeader } from '@/components/PageHeader'
import { PageSection } from '@/components/PageSection'
import { Portrait } from '@/components/Portrait'
import { SiteNote } from '@/components/SiteNote'
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
 * This file holds no markup. Every element below belongs to a
 * component that owns its own classes and takes no `className`, so the
 * page can say what goes where without being able to restyle it on the
 * way past. What is left reads as the shape of the page, which is
 * the only thing a page component should be.
 *
 * The margin-index components the index routes used are untouched in
 * src/components and globals.css. This page does not import them.
 *
 * No Payload read, so this route prerenders with no database.
 */
export default function HomePage() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>
          <Headline text={card.headline} blue={card.highlightBlue} orange={card.highlightOrange} />
        </PageHeader.Title>

        <PageHeader.Grid>
          <PageHeader.Rail>
            <Portrait src={card.portrait} alt={card.portraitAlt} />
          </PageHeader.Rail>

          <PageHeader.Main>
            <Deck>{card.intro}</Deck>
            <Bio paragraphs={card.bio} />
          </PageHeader.Main>

          <PageHeader.Facts>
            <FactList facts={card.facts} />
          </PageHeader.Facts>
        </PageHeader.Grid>
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
        <PageSection label="This site" id="site">
          <SiteNote>
            <SiteNote.Meta term={card.siteMeta.term} value={card.siteMeta.value} />
            <SiteNote.Text>{card.site}</SiteNote.Text>
          </SiteNote>
        </PageSection>
      ) : null}

      {card.contact.length ? (
        <PageSection label="Contact" id="contact">
          <ContactList links={card.contact} />
          <ContactNote>{card.contactNote}</ContactNote>
        </PageSection>
      ) : null}
    </>
  )
}
