export function AnimatedBg() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Warm primary gradient - soft amber/gold */}
          <radialGradient id="bgGrad1" cx="50%" cy="50%" r=".6">
            <stop offset="0%" stopColor="var(--primary-start)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--primary-start)" stopOpacity="0" />
          </radialGradient>
          {/* Secondary gradient - terracotta/coral accent */}
          <radialGradient id="bgGrad2" cx="50%" cy="50%" r=".55">
            <stop offset="0%" stopColor="var(--primary-end)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--primary-end)" stopOpacity="0" />
          </radialGradient>
          {/* Soft accent - subtle warmth */}
          <radialGradient id="bgGrad3" cx="50%" cy="50%" r=".5">
            <stop offset="0%" stopColor="var(--footer-link-hover)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--footer-link-hover)" stopOpacity="0" />
          </radialGradient>
          {/* Neutral depth layer */}
          <radialGradient id="bgGrad4" cx="50%" cy="50%" r=".65">
            <stop offset="0%" stopColor="var(--text-secondary)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--text-secondary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Layer 1 - Slow drift top-right */}
        <rect x="20%" y="-10%" width="120%" height="120%" fill="url(#bgGrad1)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="90s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Layer 2 - Slow drift bottom-left, counter-rotate */}
        <rect x="-15%" y="25%" width="120%" height="120%" fill="url(#bgGrad2)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 50 50"
            to="0 50 50"
            dur="80s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Layer 3 - Gentle center pulse */}
        <rect x="5%" y="10%" width="110%" height="110%" fill="url(#bgGrad3)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="100s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Layer 4 - Subtle depth movement */}
        <rect x="-5%" y="-5%" width="115%" height="115%" fill="url(#bgGrad4)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="180 50 50"
            to="540 50 50"
            dur="120s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </div>
  );
}
