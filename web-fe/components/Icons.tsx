export function IconSprite() {
  return (
    <svg width="0" height="0" className="sprite" aria-hidden="true">
      <symbol id="i-bag" viewBox="0 0 24 24">
        <path d="M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5 8Z" />
        <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
      </symbol>
      <symbol id="i-user" viewBox="0 0 24 24">
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
      </symbol>
      <symbol id="i-close" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6 6 18" />
      </symbol>
      <symbol id="i-plus" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" />
      </symbol>
      <symbol id="i-minus" viewBox="0 0 24 24">
        <path d="M5 12h14" />
      </symbol>
      <symbol id="i-menu" viewBox="0 0 24 24">
        <path d="M4 7h16M4 12h16M4 17h10" />
      </symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </symbol>
      <symbol id="i-truck" viewBox="0 0 24 24">
        <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
        <circle cx="7" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </symbol>
      <symbol id="i-trash" viewBox="0 0 24 24">
        <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
      </symbol>
    </svg>
  );
}

export function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
