import { code, doc, h, hr, link, p, quote, text, ul } from './lexical'

/* ------------------------------------------------------------------ *
 * Real content
 * ------------------------------------------------------------------ */

export const settings = {
  headline: 'I build engineering teams and the systems they run on.',
  highlightBlue: 'teams',
  highlightOrange: 'systems',
  intro:
    'Engineering operations and hiring at Fueled. I write about hiring, team process, and the tools that make product teams faster.',
  writingIntro: 'Hiring, team process, tooling, and a few CSS tricks from 2013.',
  projectsIntro: 'Current tools and experiments, plus client work from my consulting years.',
  homeListLength: 6,
  social: [
    { label: 'GitHub', url: 'https://github.com/jacobdubail', inFooter: true },
    { label: 'X', url: 'https://twitter.com/jacobdubail', inFooter: true },
  ],
}

export const about = {
  intro:
    "I'm Jacob. I work on engineering operations and hiring at Fueled, where I help our teams find great engineers and run smoothly once they're here.",
  content: doc(
    p(
      'Before that I spent years as an independent web consultant, building WordPress and e-commerce sites for agencies, think tanks and small businesses. Some of that work lives in the ',
      link('project archive', '/projects'),
      '.',
    ),
    p(
      "These days I'm most interested in hiring processes that respect candidates' time, and in using AI agents to take the busywork out of team operations.",
    ),
    p('[Draft written during the rebuild. Edit in the admin under Site → About.]'),
  ),
  now: [
    { label: 'work', value: 'Engineering ops + hiring at Fueled' },
    {
      label: 'building',
      value: 'Agent workflows for Linear; an evaluation assistant for Greenhouse',
    },
    { label: 'writing', value: 'Notes on hiring loops that scale' },
  ],
}

const importPending = p(
  'The full text of this post comes over from WordPress. Export the site (Tools → Export → All content) and run ',
  text('pnpm import:wordpress', 16), // 16 = inline code
  ' to replace this placeholder.',
)

/** The two posts that were live on the old site (metadata only until the WP import runs). */
export const archivedPosts = [
  {
    title: 'Hello again world!',
    slug: 'hello-again-world',
    publishedAt: '2013-08-23T04:08:49.000Z',
    excerpt: 'The fourth incarnation of this site, as a hybrid portfolio and blog.',
    tags: ['meta'],
    originalUrl: 'https://www.jacobdubail.com/hello-again-world/',
    content: doc(importPending),
  },
  {
    title: 'Box Shadow Color Hack',
    slug: 'box-shadow-color-hack',
    publishedAt: '2013-08-20T16:35:07.000Z',
    excerpt: 'Letting box-shadow inherit its color in modular CSS.',
    tags: ['css', 'scss'],
    originalUrl: 'https://www.jacobdubail.com/box-shadow-color-hack/',
    content: doc(importPending),
  },
]

/** Client work listed on the old site's Work section. */
export const archivedProjects = [
  {
    title: 'Hamilton Hounds',
    slug: 'hamilton-hounds',
    year: 2013,
    summary: 'E-commerce for a pet supply brand.',
    role: 'E-commerce, full service, mobile design',
    stack: 'WordPress, FoxyCart, responsive design',
    industry: 'Pet supplies',
    siteUrl: 'hamiltonhounds.com',
  },
  {
    title: 'Human Condition',
    slug: 'human-condition',
    year: 2013,
    summary: 'Responsive site for a think tank.',
    role: 'Design to website, mobile design',
    stack: 'Responsive design',
    industry: 'Think tank',
    siteUrl: 'humanconditionglobal.com',
  },
  {
    title: 'rno1',
    slug: 'rno1',
    year: 2012,
    summary: 'Responsive build for a digital agency.',
    role: 'Design to website, mobile design',
    stack: 'HTML5, CSS3, responsive design',
    industry: 'Digital agency',
    siteUrl: 'rno1.com',
  },
  {
    title: 'Kovacs Perez Law',
    slug: 'kovacs-perez-law',
    year: 2012,
    summary: 'Multilingual site for a law firm.',
    role: 'Full service',
    stack: 'HTML5, CSS3, multilingual',
    industry: 'Legal',
  },
  {
    title: 'NCM East',
    slug: 'ncm-east',
    year: 2011,
    summary: 'Full-service site for a music company.',
    role: 'Full service, mobile design',
    stack: 'Responsive design',
    industry: 'Music',
    siteUrl: 'ncmeast.com',
  },
]

/* ------------------------------------------------------------------ *
 * Demo placeholders (only with `pnpm seed:demo`). Titles are invented
 * so the lists look full; delete them in the admin when real posts land.
 * ------------------------------------------------------------------ */

const demoBody = doc(
  p(
    'Placeholder post created by the demo seed. Headings, links, images, code and embeds each map to a block, so archived WordPress posts and new posts render the same way.',
  ),
  h('h3', 'What changed'),
  ul(
    'One scorecard per role, written before the first interview.',
    'Take-homes capped at two hours, reviewed against the scorecard.',
    'Every panel debriefs in writing before anyone talks.',
  ),
  quote('The loop got faster the moment we stopped trying to make every interview do everything.'),
  p(
    'An outside link looks like ',
    link('this one', 'https://example.com'),
    ', and the section break below is the split chevron between two hairlines.',
  ),
  hr(),
  code(
    'css',
    '.halo { box-shadow: 0 0 0 4px; }\n.halo--red  { color: $red; }\n.halo--blue { color: $blue; }',
    'Code blocks use JetBrains Mono.',
  ),
)

export const demoPosts = [
  [
    'Designing a hiring loop that scales',
    'designing-a-hiring-loop',
    '2026-10-14',
    'What changed once interviews stopped being the bottleneck.',
    ['hiring', 'process'],
  ],
  [
    'Automating Linear triage with agents',
    'linear-triage-agents',
    '2026-09-02',
    'Notes from a month of letting agents sort the backlog.',
    ['ai', 'tooling'],
  ],
  [
    'What I look for in a take-home review',
    'take-home-review',
    '2026-08-12',
    'Signals that matter more than passing tests.',
    ['hiring'],
  ],
  [
    'Interview calibration without the meetings',
    'interview-calibration',
    '2026-07-08',
    'Keeping a panel consistent with a shared rubric and a little tooling.',
    ['hiring', 'process'],
  ],
  [
    'Rebuilding this site with Payload and Next.js',
    'rebuilding-with-payload',
    '2026-06-20',
    'Leaving WordPress after thirteen years, and what came along.',
    ['tooling'],
  ],
  [
    'Engineering ops at an agency',
    'engineering-ops-at-an-agency',
    '2025-11-04',
    'Running many small teams instead of one large one.',
    ['process'],
  ],
  [
    'Write skills, not prompts',
    'write-skills-not-prompts',
    '2025-09-16',
    'Packaging team knowledge so an agent can reuse it.',
    ['ai'],
  ],
].map(([title, slug, date, excerpt, tags]) => ({
  title: title as string,
  slug: slug as string,
  publishedAt: new Date(`${date}T16:00:00.000Z`).toISOString(),
  excerpt: excerpt as string,
  tags: tags as string[],
  content: demoBody,
}))

export const demoProjects = [
  {
    title: 'Candidate evaluation assistant',
    slug: 'candidate-evaluation-assistant',
    year: 2026,
    summary: 'AI-assisted review for engineering hiring.',
    role: 'Design + build',
    stack: 'Claude, Greenhouse API',
    ongoing: true,
  },
  {
    title: 'Linear triage agent',
    slug: 'linear-triage-agent',
    year: 2026,
    summary: 'Routes and labels incoming issues across teams.',
    role: 'Design + build',
    stack: 'Claude, Linear API',
    ongoing: true,
  },
  {
    title: 'jacobdubail.com',
    slug: 'jacobdubail-com',
    year: 2026,
    summary: 'This site: Payload CMS on Next.js, with View Transitions.',
    role: 'Design + build',
    stack: 'Next.js 16, Payload 3, Postgres',
    ongoing: true,
    siteUrl: 'jacobdubail.com',
  },
  {
    title: 'Interview kit generator',
    slug: 'interview-kit-generator',
    year: 2025,
    summary: 'Turns a role scorecard into structured interview guides.',
    role: 'Build',
    stack: 'Claude, Notion',
  },
].map((d) => ({
  ...d,
  content: doc(p('Placeholder project created by the demo seed. Replace with the real write-up.')),
}))
