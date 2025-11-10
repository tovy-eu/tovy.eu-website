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
          d="M-200,500 C200,300 600,700 1000,500 S1800,300 2200,500"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDuration: '10s' }}
        />
        <path
          d="M-200,510 C200,310 600,710 1000,510 S1800,310 2200,510"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-3s', animationDuration: '12s' }}
        />
        <path
          d="M-200,520 C200,320 600,720 1000,520 S1800,320 2200,520"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-1s', animationDuration: '8s' }}
        />
        <path
          d="M-200,530 C200,330 600,730 1000,530 S1800,330 2200,530"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-6s', animationDuration: '15s' }}
        />
        <path
          d="M-200,540 C200,340 600,740 1000,540 S1800,340 2200,540"
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
