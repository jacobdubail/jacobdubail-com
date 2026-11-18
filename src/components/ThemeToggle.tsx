'use client'

/**
 * Light/dark switch. Follows the OS until clicked; the choice is stored
 * per browser.
 *
 * Both labels are rendered and CSS picks one, so the button is correct
 * in the static HTML and never flips on hydration — a server snapshot
 * of "light" would have flashed the wrong word at every dark-mode
 * visitor.
 *
 * Two things changed after the first design round, where all three
 * reviewers stopped on this control for the same two reasons.
 *
 * It had no affordance: a bare grey word in the footer, indistinguishable
 * from the copyright line beside it. It is a bordered control now, in
 * the same vocabulary .chip-state already uses — one border token, one
 * radius, nothing new — with a half-filled disc that is the thing the
 * button does rather than a borrowed sun and moon. The page draws two
 * shapes, the chevron and the arrow, and neither of them is a crescent.
 *
 * And the word named the current state, so "Light" could equally have
 * meant "you are in light mode" or "click for light mode". It names the
 * destination now. The sr-only clarifier closes the rest of the gap and
 * keeps the accessible name a superset of the visible label (WCAG
 * 2.5.3) — an aria-label here would win the name computation outright
 * and silently discard the visible word.
 */
export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={() => {
        const next = !document.documentElement.classList.contains('dark')
        document.documentElement.classList.toggle('dark', next)
        try {
          localStorage.setItem('theme', next ? 'dark' : 'light')
        } catch {}
      }}
      className="toggle"
    >
      <span className="polarity" aria-hidden />
      <span className="dark:hidden">Dark</span>
      <span className="not-dark:hidden">Light</span>
      <span className="sr-only"> theme, switch to it</span>
    </button>
  )
}

/** Inline, render-blocking script so the right theme is applied before first paint. */
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`
