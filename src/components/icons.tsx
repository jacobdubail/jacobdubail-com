import { LOGO_PATH, LOGO_VIEWBOX } from './logo-path'

type IconProps = { className?: string; title?: string }

export function Logo({ className, title }: IconProps) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      fill="currentColor"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path fillRule="evenodd" d={LOGO_PATH} />
    </svg>
  )
}

export const ARROW_PATH =
  'M2.00 13.70L17.59 13.70L17.59 18.30L6.60 18.30ZM29.00 16.00L18.00 5.00L14.75 8.25L22.49 16.00L14.75 23.75L18.00 27.00Z'

/** Shaft with the logo's 45° tail, a small break, then the head. Hover + back links. */
export function GappedArrow({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
      <path d={ARROW_PATH} />
    </svg>
  )
}

export const CHEV_UPPER = 'M25.40 14.40L15.00 4.00L11.75 7.25L18.89 14.40Z'
export const CHEV_LOWER = 'M25.40 17.60L15.00 28.00L11.75 24.75L18.89 17.60Z'

/** Split chevron whose arms slide apart and back while a page loads. */
export function ScissorLoader({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={`scissor overflow-visible ${className ?? ''}`}
      role="img"
      aria-label="Loading"
    >
      <path className="u" d={CHEV_UPPER} />
      <path className="l" d={CHEV_LOWER} />
    </svg>
  )
}
