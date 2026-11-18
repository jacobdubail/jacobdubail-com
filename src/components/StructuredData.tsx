/**
 * The page, restated as a schema.org graph.
 *
 * Everything in here is already on screen in English. The job of this
 * element is to say it again in a vocabulary a machine does not have to
 * guess at — which matters more than usual for this page, because its
 * readers now include models summarising a candidate for someone who
 * will never open the site. Prose leaves them to infer the employer
 * from a preposition and the seniority from a tone. A graph does not.
 *
 * ONE GRAPH, NOT THREE SCRIPTS. The nodes reference each other by
 * `@id`, so the WebPage can say it is about the Person and the Person
 * can say which page it is the subject of without either repeating the
 * other. Separate <script> blocks cannot do that: a consumer is free to
 * read one and drop the rest, and then the Person is a floating record
 * of a man with no page attached.
 *
 * NOT ProfilePage, which is the type that looks right and is not.
 * Google documents it for pages where creators publish first-hand
 * perspectives — forum profiles, author pages, social accounts — and
 * the rich result it drives is for that. This is a personal home page,
 * so WebPage carrying `mainEntity` says the same thing in the general
 * vocabulary and asks for no treatment it would not get. ProfilePage
 * goes in when /writing does, and the posts have an author to point at.
 *
 * The escaping is not decoration. `JSON.stringify` will happily emit
 * `</script>` out of a string and end the block early, so every `<`
 * leaves as `<`, which is the same string to a JSON parser and
 * inert to an HTML one. Today every value here is a literal from
 * card.ts; the day one of them comes back from Payload instead, this
 * line is the only thing standing between a CMS field and injected
 * markup. See node_modules/next/dist/docs/01-app/02-guides/json-ld.md.
 */

type Profile = {
  name: string
  jobTitles: string[]
  employer: { name: string; url: string }
  locality: string
  region: string
  country: string
  knows: string[]
}

export function StructuredData({
  profile,
  siteUrl,
  siteName,
  description,
  image,
  imageAlt,
  sameAs,
}: {
  profile: Profile
  siteUrl: string
  siteName: string
  description: string
  image?: string | null
  imageAlt: string
  sameAs: string[]
}) {
  /* Fragment ids on the canonical URL, so the identifiers survive the
     site moving host and stay distinct from the URLs themselves. A node
     whose @id is the page URL is a node a consumer may merge with the
     page it was served from. */
  const id = (fragment: string) => `${siteUrl}/#${fragment}`
  const portrait = image ? new URL(image, siteUrl).href : null

  const graph = [
    {
      '@type': 'WebSite',
      '@id': id('website'),
      url: `${siteUrl}/`,
      name: siteName,
      inLanguage: 'en',
      publisher: { '@id': id('person') },
    },
    {
      '@type': 'WebPage',
      '@id': id('webpage'),
      url: `${siteUrl}/`,
      name: siteName,
      description,
      inLanguage: 'en',
      isPartOf: { '@id': id('website') },
      /* `about` and `mainEntity` are not the same claim. `about` says
         the page discusses him; `mainEntity` says he is the one thing
         it is for. On a page with three sections and one subject both
         are true, and consumers read one or the other. */
      about: { '@id': id('person') },
      mainEntity: { '@id': id('person') },
      ...(portrait ? { primaryImageOfPage: { '@id': id('portrait') } } : {}),
    },
    ...(portrait
      ? [
          {
            '@type': 'ImageObject',
            '@id': id('portrait'),
            url: portrait,
            contentUrl: portrait,
            caption: imageAlt,
          },
        ]
      : []),
    {
      '@type': 'Person',
      '@id': id('person'),
      name: profile.name,
      url: `${siteUrl}/`,
      description,
      jobTitle: profile.jobTitles,
      worksFor: {
        '@type': 'Organization',
        name: profile.employer.name,
        url: profile.employer.url,
      },
      /* Locality and region only. The page names an island and a
         state, and so does this. */
      address: {
        '@type': 'PostalAddress',
        addressLocality: profile.locality,
        addressRegion: profile.region,
        addressCountry: profile.country,
      },
      knowsAbout: profile.knows,
      ...(portrait ? { image: { '@id': id('portrait') } } : {}),
      mainEntityOfPage: { '@id': id('webpage') },
      /* The profiles that prove this is the same person elsewhere.
         Every href the contact block renders, and nothing else — a
         sameAs pointing at an account nobody tends is the rel="me"
         problem written out in JSON. */
      sameAs,
    },
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(
          /</g,
          '\\u003c',
        ),
      }}
    />
  )
}
