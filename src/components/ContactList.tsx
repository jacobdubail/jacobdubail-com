export type ContactLink = {
  /** Gutter label. Short — it sits in a 112px column. */
  label: string
  /** What the reader sees and can read aloud over the phone. */
  value: string
  href: string
}

/**
 * The contact rows.
 *
 * No per-row size tier: order and the letterhead carry the rank. The
 * LinkedIn row ran at --text-xl for two rounds, which made the loudest
 * sentence on a hiring page an address bar. A URL already carries
 * length, a rule beneath it and an accent colour.
 */
export function ContactList({ links }: { links: readonly ContactLink[] }) {
  if (!links.length) return null

  return (
    <dl className="pt-2">
      {links.map((link) => (
        <div key={link.label} className="contact-row">
          <dt>{link.label}</dt>
          <dd>
            {/* Every row is a profile of the same person, which is
                what rel="me" is for. */}
            <a href={link.href} className="ext ext-link" rel="me">
              {link.value}
            </a>
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** The lines under the rows. Renders nothing when there are none. */
export function ContactNote({ children }: { children?: string | null }) {
  if (!children) return null
  return <p className="contact-note rail-offset">{children}</p>
}
