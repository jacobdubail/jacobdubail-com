import type { Metadata } from 'next'
import Image from 'next/image'

import { GappedArrow } from '@/components/icons'
import { IndexSection } from '@/components/IndexSection'
import { PageHeader } from '@/components/PageHeader'
import { RichText } from '@/components/RichText'
import { getAbout, getSettings } from '@/lib/queries'

export const metadata: Metadata = { title: 'About' }

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSettings()])
  const portrait = typeof about.portrait === 'object' ? about.portrait : null

  return (
    <>
      <PageHeader
        title="About"
        mark={
          portrait?.url ? (
            <Image
              src={portrait.url}
              alt={portrait.alt ?? 'Jacob Dubail'}
              width={192}
              height={192}
              className="size-20 rounded-md border border-line object-cover"
              priority
            />
          ) : null
        }
      />
      {/* No deck here. On a list page the intro is the last text before a
          list, so setting it larger and lighter costs nothing. On About
          there are four paragraphs under it, and a lighter deck above
          darker body copy reads as a pulled quotation rather than the
          page's opening sentence. It is just the first paragraph. */}
      <div className="index-offset mt-[var(--gap-art-block)]">
        {about.intro ? <p className="prose-lead">{about.intro}</p> : null}
        <RichText data={about.content} />
      </div>

      {about.now?.length ? (
        <IndexSection label="Now" group lead>
          {/* The sub-column borrows the page's own gutter tokens rather
              than a 96px/16px pair that lands 32px off the rhythm it is
              imitating. */}
          <dl className="grid grid-cols-[var(--label-w)_minmax(0,1fr)] gap-x-[var(--label-gap)] gap-y-3 pt-4">
            {about.now.map((n) => (
              <div key={n.id ?? n.label} className="contents">
                <dt className="pt-0.5 text-sm text-faint">{n.label}</dt>
                <dd className="leading-[1.55]">{n.value}</dd>
              </div>
            ))}
          </dl>
        </IndexSection>
      ) : null}

      {settings.social?.length ? (
        <IndexSection label="Elsewhere" group>
          <ul className="flex flex-wrap gap-2 pt-4">
            {settings.social.map((l) => (
              <li key={l.id ?? l.url}>
                <a
                  href={l.url}
                  rel="me"
                  /* .chip's own size, not a third one: the stylesheet says fill
                     and case are the only things that may separate two chips,
                     never size. .chip-tap buys the 24px target with an
                     overlay, since padding would grow the chip itself. */
                  className="chip chip-tap group inline-flex items-center gap-1.5 hover:border-line-strong hover:text-orange-text"
                >
                  <GappedArrow className="w-[9px] text-orange" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </IndexSection>
      ) : null}
    </>
  )
}
