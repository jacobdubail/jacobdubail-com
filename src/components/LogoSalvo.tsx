'use client'

import { useEffect, useRef, useState } from 'react'

import { Logo } from './icons'

/**
 * The logo fires a volley of chevrons when Shift is tapped three times.
 *
 * Detection has to survive ordinary typing, and the naive version does not:
 * capitalising three letters is three Shift presses. The fix is that ANY
 * non-Shift key resets the count, so "Hello World" can never reach three —
 * the H, the e, the space all clear it. What survives is Shift, Shift, Shift
 * with nothing in between, which is not a thing anyone does by accident.
 *
 * Held keys repeat, so e.repeat is ignored; otherwise leaning on Shift would
 * fire it. Fields are excluded outright, which matters for the admin's search
 * and for anything a future form adds here.
 *
 * Decorative and nothing else: aria-hidden, no focus moves, no announcement,
 * pointer-events none so it can never swallow a click on the home link.
 * prefers-reduced-motion is read at fire time rather than at mount, so
 * changing the OS setting takes effect without a reload.
 */

const SHOTS = 7
/** Max gap between taps. Long enough to be comfortable, short enough that
 *  three deliberate presses are the only way through. */
const WINDOW_MS = 700

export function LogoSalvo({ className }: { className?: string }) {
  const [volley, setVolley] = useState(0)
  const firing = useRef(false)

  useEffect(() => {
    let count = 0
    let last = 0

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return

      if (e.key !== 'Shift') {
        count = 0
        return
      }
      if (e.repeat) return

      count = e.timeStamp - last > WINDOW_MS ? 1 : count + 1
      last = e.timeStamp
      if (count < 3) return

      count = 0
      if (firing.current) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      firing.current = true
      setVolley((v) => v + 1)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!volley) return
    // Outlives the longest shot (last delay + duration) so nothing is cut off,
    // and clearing the volley unmounts the nodes rather than leaving them
    // parked at opacity 0.
    const t = window.setTimeout(() => {
      firing.current = false
      setVolley(0)
    }, 1200)
    return () => window.clearTimeout(t)
  }, [volley])

  return (
    <span className="salvo-mount">
      <Logo className={className} title="Jacob Dubail" />
      {volley > 0 && (
        <span className="salvo" key={volley} aria-hidden>
          {Array.from({ length: SHOTS }, (_, i) => (
            <span className="salvo-shot" key={i} style={{ '--i': String(i) } as React.CSSProperties} />
          ))}
        </span>
      )}
    </span>
  )
}
