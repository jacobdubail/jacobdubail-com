import type { ReactNode } from 'react'

export function PageHeader({ title, intro }: { title: ReactNode; intro?: string | null }) {
  return (
    <div className="index-offset">
      <h1 className="mb-3 w-fit font-serif text-display font-normal tracking-[-0.02em]">{title}</h1>
      {intro ? <p className="max-w-[36em] leading-[1.6] text-balance text-ink2">{intro}</p> : null}
    </div>
  )
}
