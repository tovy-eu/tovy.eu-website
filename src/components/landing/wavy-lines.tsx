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
            <stop offset="100%" stopColor="hsl(var(--accent-gradient-stop))" />
          </linearGradient>
        </defs>
        <path
          d="M-200,530 C200,330 600,730 1000,530 S1800,330 2200,530 S3000,730 3400,530"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="2"
          className="animated-wavy-line"
          style={{ animationDuration: '10s' }}
        />
        <path
          d="M-200,540 C200,340 600,740 1000,540 S1800,340 2200,540 S3000,740 3400,540"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="2"
          className="animated-wavy-line"
          style={{ animationDelay: '-3s', animationDuration: '12s' }}
        />
        <path
          d="M-200,550 C200,350 600,750 1000,550 S1800,350 2200,550 S3000,750 3400,550"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="2"
          className="animated-wavy-line"
          style={{ animationDelay: '-1s', animationDuration: '8s' }}
        />
        <path
          d="M-200,560 C200,360 600,760 1000,560 S1800,360 2200,560 S3000,760 3400,560"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="2"
          className="animated-wavy-line"
          style={{ animationDelay: '-6s', animationDuration: '15s' }}
        />
        <path
          d="M-200,570 C200,370 600,770 1000,570 S1800,370 2200,570 S3000,770 3400,570"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="2"
          className="animated-wavy-line"
          style={{ animationDelay: '-4s', animationDuration: '9s' }}
        />
      </svg>
    </div>
  );
}
