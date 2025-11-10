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
          d="M-200,700 C200,500 600,900 1000,700 S1800,500 2200,700"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDuration: '10s' }}
        />
        <path
          d="M-200,710 C200,510 600,910 1000,710 S1800,510 2200,710"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-3s', animationDuration: '12s' }}
        />
        <path
          d="M-200,720 C200,520 600,920 1000,720 S1800,520 2200,720"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-1s', animationDuration: '8s' }}
        />
        <path
          d="M-200,730 C200,530 600,930 1000,730 S1800,530 2200,730"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-6s', animationDuration: '15s' }}
        />
        <path
          d="M-200,740 C200,540 600,940 1000,740 S1800,540 2200,740"
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
