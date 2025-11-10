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
          d="M-200,750 C200,550 600,950 1000,750 S1800,550 2200,750"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDuration: '10s' }}
        />
        <path
          d="M-200,760 C200,560 600,960 1000,760 S1800,560 2200,760"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-3s', animationDuration: '12s' }}
        />
        <path
          d="M-200,770 C200,570 600,970 1000,770 S1800,570 2200,770"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-1s', animationDuration: '8s' }}
        />
        <path
          d="M-200,780 C200,580 600,980 1000,780 S1800,580 2200,780"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-6s', animationDuration: '15s' }}
        />
        <path
          d="M-200,790 C200,590 600,990 1000,790 S1800,590 2200,790"
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
