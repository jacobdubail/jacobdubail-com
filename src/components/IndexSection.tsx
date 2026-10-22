import type { ReactNode } from 'react'

/**
 * Margin-index section: a sticky label in the left column, content on the right.
 * Below 720px the label becomes a slim sticky header above the list.
 */
export function IndexSection({
  label,
  aside,
  children,
  className,
}: {
  label: string
  aside?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`index-section ${className ?? 'mt-16'}`}>
      <h2 className="index-label">
        <span className="name">
          {label}
          <span className="chev" aria-hidden />
        </span>
        {aside ? <span className="text-xs text-faint">{aside}</span> : null}
      </h2>
      <div className="index-rows">{children}</div>
    </section>
  )
}
