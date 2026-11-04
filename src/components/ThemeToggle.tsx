'use client'

import { useSyncExternalStore } from 'react'

const subscribe = (cb: () => void) => {
  const obs = new MutationObserver(cb)
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => obs.disconnect()
}
const getSnapshot = () => document.documentElement.classList.contains('dark')
const getServerSnapshot = () => false

/**
 * Light/dark switch. Follows the OS until clicked; the choice is stored per
 * browser. The visible label names the current theme rather than the
 * destination, so it cannot be misread as a status line.
 */
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return (
    <button
      type="button"
      aria-pressed={dark}
      onClick={() => {
        const next = !dark
        document.documentElement.classList.toggle('dark', next)
        try {
          localStorage.setItem('theme', next ? 'dark' : 'light')
        } catch {}
      }}
      className="tap cursor-pointer hover:text-fg"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? 'Dark' : 'Light'}
      <span className="sr-only"> theme — switch to {dark ? 'light' : 'dark'}</span>
    </button>
  )
}

/** Inline, render-blocking script so the right theme is applied before first paint. */
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`
