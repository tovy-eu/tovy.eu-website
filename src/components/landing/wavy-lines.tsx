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
          strokeWidth="2"
          className="animated-wavy-line"
          style={{ animationDuration: '12s' }}
        />
        <path
          d="M-200,450 C200,250 600,650 1000,450 S1800,250 2200,450"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="2"
          className="animated-wavy-line"
          style={{ animationDelay: '-5s', animationDuration: '15s' }}
        />
        <path
          d="M-200,500 C200,300 600,700 1000,500 S1800,300 2200,500"
          fill="none"
          stroke="url(#wavy-gradient)"
          strokeWidth="2"
          className="animated-wavy-line"
          style={{ animationDelay: '-2s', animationDuration: '20s' }}
        />
      </svg>
    </div>
  );
}
