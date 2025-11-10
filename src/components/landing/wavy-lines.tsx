export function WavyLines() {
  return (
    <div className="absolute inset-0 z-0 opacity-20">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wavy-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="#8F668C" />
          </linearGradient>
        </defs>
        <path
          d="M-200,550 C200,350 600,750 1000,550 S1800,350 2200,550"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDuration: '10s' }}
        />
        <path
          d="M-200,560 C200,360 600,760 1000,560 S1800,360 2200,560"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-3s', animationDuration: '12s' }}
        />
        <path
          d="M-200,570 C200,370 600,770 1000,570 S1800,370 2200,570"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-1s', animationDuration: '8s' }}
        />
        <path
          d="M-200,580 C200,380 600,780 1000,580 S1800,380 2200,580"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-6s', animationDuration: '15s' }}
        />
        <path
          d="M-200,590 C200,390 600,790 1000,590 S1800,390 2200,590"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-4s', animationDuration: '9s' }}
        />
      </svg>
    </div>
  );
}
