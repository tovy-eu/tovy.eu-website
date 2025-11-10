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
          d="M-200,400 C200,200 600,600 1000,400 S1800,200 2200,400"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDuration: '10s' }}
        />
        <path
          d="M-200,410 C200,210 600,610 1000,410 S1800,210 2200,410"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-3s', animationDuration: '12s' }}
        />
        <path
          d="M-200,420 C200,220 600,620 1000,420 S1800,220 2200,420"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-1s', animationDuration: '8s' }}
        />
        <path
          d="M-200,430 C200,230 600,630 1000,430 S1800,230 2200,430"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="1.5"
          className="animated-wavy-line"
          style={{ animationDelay: '-6s', animationDuration: '15s' }}
        />
        <path
          d="M-200,440 C200,240 600,640 1000,440 S1800,240 2200,440"
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
