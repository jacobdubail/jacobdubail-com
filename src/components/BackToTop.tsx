export function BackToTop() {
  return (
    <a href="#top" className="group inline-flex items-center gap-1.5 hover:text-fg">
      Top
      <span
        className="chev -rotate-90 text-orange transition-transform group-hover:-translate-y-0.5"
        aria-hidden
      />
    </a>
  )
}
