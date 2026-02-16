/** Логотип Vista AI-Human Factor: ядро и три атома на орбитах */
export default function LogoVista({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Ядро (центр) */}
      <circle cx="16" cy="16" r="4" fill="currentColor" />
      {/* Орбита 1 — горизонтальная, атом справа */}
      <ellipse cx="16" cy="16" rx="12" ry="5" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.9" />
      <circle cx="28" cy="16" r="2.5" fill="currentColor" />
      {/* Орбита 2 — повёрнута 120°, атом внизу слева (10, 26) */}
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="5"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.9"
        transform="rotate(120 16 16)"
      />
      <circle cx="10" cy="26" r="2.5" fill="currentColor" />
      {/* Орбита 3 — повёрнута 240°, атом вверху слева (10, 6) */}
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="5"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.9"
        transform="rotate(240 16 16)"
      />
      <circle cx="10" cy="6" r="2.5" fill="currentColor" />
    </svg>
  );
}
