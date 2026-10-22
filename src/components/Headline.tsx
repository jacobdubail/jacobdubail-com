import type { ReactNode } from 'react'

/** Renders the hero headline with one word in azure and one in tangerine. */
export function Headline({
  text,
  blue,
  orange,
}: {
  text: string
  blue?: string | null
  orange?: string | null
}) {
  const words = [blue, orange].filter(Boolean) as string[]
  if (!words.length) return <>{text}</>
  const pattern = new RegExp(
    `(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
  )
  const parts: ReactNode[] = text.split(pattern).map((part, i) => {
    if (part === blue)
      return (
        <span key={i} className="text-blue">
          {part}
        </span>
      )
    if (part === orange)
      return (
        <span key={i} className="text-orange">
          {part}
        </span>
      )
    return part
  })
  return <>{parts}</>
}
