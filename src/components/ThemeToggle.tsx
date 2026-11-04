'use client'

/**
 * Light/dark switch. Follows the OS until clicked; the choice is stored per
 * browser.
 *
 * Both labels are rendered and CSS picks one, so the button is correct in the
 * static HTML and never flips on hydration — a server snapshot of "light"
 * would have flashed the wrong word at every dark-mode visitor.
 *
 * The visible word names the current theme and the sr-only clarifier names the
 * action, so the accessible name contains the visible label (WCAG 2.5.3). An
 * aria-label here would win the name computation outright and silently discard
 * the visible word.
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
      className="tap cursor-pointer hover:text-fg"
    >
      <span className="dark:hidden">Light</span>
      <span className="not-dark:hidden">Dark</span>
      <span className="sr-only"> theme — switch to the other one</span>
    </button>
  )
}

/** Inline, render-blocking script so the right theme is applied before first paint. */
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`
