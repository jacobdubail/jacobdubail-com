import { card } from '@/content/card'
import { plainText as plain } from '@/lib/format'
import { siteName, siteUrl } from '@/lib/site'

/**
 * /llms.txt — the page as Markdown, for readers that do not render.
 *
 * An agent sent to answer "who is this and what has he built" currently
 * parses 34KB of HTML, most of it Tailwind class attributes and a
 * serialised React tree, to recover about 2KB of sentences. This route
 * hands over the sentences. Same claims, same order, no markup, and it
 * costs the site nothing: no runtime data, so it prerenders at build
 * alongside the page it describes.
 *
 * FORMAT, per llmstxt.org: an H1 with the name is the only required
 * part. After it, optionally, a blockquote summary, then detail
 * sections in any Markdown EXCEPT headings, then H2 sections holding
 * lists of links — `[name](url)`, optionally followed by `:` and a
 * note. An H2 named "Optional" is the convention for links a reader
 * may skip. That is why the facts, the bio and the work list are a
 * heading-free run of Markdown rather than the three `##` sections
 * they want to be: the spec reserves H2 for link lists.
 *
 * ONE DEVIATION, on purpose: the contact note is a sentence under an
 * H2 that the spec reserves for a list of links. It stays there
 * because what it says is which of the two links to use, and a
 * reader that has already passed the list has been told too late.
 *
 * SERVED AS text/plain. The file is Markdown and `text/markdown` is
 * the honest type, but plain text is what the overwhelming majority of
 * deployed llms.txt files answer with, it is what the clients were
 * built against, and it renders in a browser for the one human who
 * ever checks. The head of every page advertises this URL with
 * rel="describedby" — see layout.tsx.
 *
 * It reads card.ts and nothing else, which is the point. A second copy
 * of this copy, drifting, would be worse than no copy at all: an agent
 * that finds a stale employer here quotes it with more confidence than
 * it would have quoted the page.
 */

const factValue = (value: string | string[]) => (Array.isArray(value) ? value.join(', ') : value)

export async function GET() {
  const facts = card.facts.map((f) => `**${f.term}:** ${plain(factValue(f.value))}`)
  const work = card.work.map(
    (w) => `- **${plain(w.title)}** (${plain(w.meta)}) — ${plain(w.description)}`,
  )
  const contact = card.contact.map((c) => `- [${c.label}](${c.href}): ${c.value}`)

  const body = [
    `# ${siteName}`,
    '',
    `> ${plain(card.intro)}`,
    '',
    plain(card.headline),
    '',
    ...facts,
    `**Employer:** ${card.profile.employer.name} (${card.profile.employer.url})`,
    '',
    ...card.bio.flatMap((p) => [plain(p), '']),
    'Selected work:',
    '',
    ...work,
    ...(card.site ? ['', `About this page: ${plain(card.site)}`] : []),
    '',
    '## Contact',
    '',
    ...contact,
    ...(card.contactNote ? ['', plain(card.contactNote)] : []),
    '',
    '## Optional',
    '',
    `- [${siteName}](${siteUrl}/): the same content as a web page.`,
    `- [Sitemap](${siteUrl}/sitemap.xml): every URL on the site, which is this one.`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
