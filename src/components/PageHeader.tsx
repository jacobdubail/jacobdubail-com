import type { ReactNode } from 'react'

export function PageHeader({ title, intro }: { title: ReactNode; intro?: string | null }) {
  return (
    <div className="page-header index-offset">
      <h1 className="w-fit font-serif text-display font-normal tracking-[-0.02em]">{title}</h1>
      {intro ? (
        <p className="mt-4 max-w-[34em] text-md leading-[1.55] text-balance text-ink2">{intro}</p>
      ) : null}
    </div>
  )
}
