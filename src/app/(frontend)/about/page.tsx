import type { Metadata } from 'next'
import Image from 'next/image'

import { GappedArrow } from '@/components/icons'
import { IndexSection } from '@/components/IndexSection'
import { RichText } from '@/components/RichText'
import { getAbout, getSettings } from '@/lib/queries'

export const metadata: Metadata = { title: 'About' }

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSettings()])
  const portrait = typeof about.portrait === 'object' ? about.portrait : null

  return (
    <>
      <div className="index-offset">
        <div className="mb-8 flex items-center gap-6">
          {portrait?.url ? (
            <Image
              src={portrait.url}
              alt={portrait.alt ?? 'Jacob Dubail'}
              width={192}
              height={192}
              className="size-24 rounded-lg border border-line object-cover"
              priority
            />
          ) : null}
          <h1 className="w-fit font-serif text-display font-normal tracking-[-0.02em]">About</h1>
        </div>
        {about.intro ? <p className="mb-6 text-md leading-[1.6] text-mute">{about.intro}</p> : null}
        <RichText data={about.content} />
      </div>

      {about.now?.length ? (
        <IndexSection label="Now">
          <dl className="grid grid-cols-[96px_1fr] gap-x-4 gap-y-3 pt-4">
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
        <IndexSection label="Elsewhere" className="mt-12">
          <ul className="flex flex-wrap gap-2 pt-4">
            {settings.social.map((l) => (
              <li key={l.id ?? l.url}>
                <a
                  href={l.url}
                  rel="me"
                  className="group inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm hover:border-orange-text hover:text-orange-text"
                >
                  <GappedArrow className="w-[11px] text-orange" />
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
