import { cn } from "@/lib/utils"

export function AiChipIcon({ className }: { className?: string }) {
  const circuitPaths = [
    "M64 128V88h24v40",
    "M64 88V64h24v24",
    "M88 88h16",
    "M88 64h16",
    "M128 128V88h-24v40",
    "M128 88V64h-24v24",
    "M104 88h24",
    "M104 64h24",
    "M128 64H88v24h40",
    "M88 88h16v16h24",
    "M64 64h24v24H64z"
  ];
  const circuitStyles = (index: number) => ({
    animationDelay: `${index * 0.1}s`,
  });

  return (
    <div className={cn("w-32 h-32", className)}>
      <svg viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0)" />
            <stop offset="50%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
          </linearGradient>
        </defs>

        {/* Chip Body */}
        <rect x="48" y="48" width="96" height="96" rx="8" stroke="hsl(var(--border))" strokeWidth="2" fill="hsl(var(--background))" />
        
        {/* Core */}
        <rect x="64" y="64" width="64" height="64" rx="4" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="1" />
        
        {/* Animated Circuits */}
        {circuitPaths.map((d, i) => (
           <path key={i} d={d} stroke="url(#circuit-gradient)" strokeWidth="1.5" strokeLinecap="round" className="animated-circuit-path" style={circuitStyles(i)} />
        ))}
        
        {/* Connection Pads */}
        {[...Array(8)].map((_, i) => (
          <rect key={i} x="32" y={52 + i * 11} width="12" height="8" rx="2" fill="hsl(var(--border))" />
        ))}
        {[...Array(8)].map((_, i) => (
          <rect key={i} x="148" y={52 + i * 11} width="12" height="8" rx="2" fill="hsl(var(--border))" />
        ))}
        {[...Array(8)].map((_, i) => (
          <rect key={i} x={52 + i * 11} y="32" width="8" height="12" rx="2" fill="hsl(var(--border))" />
        ))}
        {[...Array(8)].map((_, i) => (
          <rect key={i} x={52 + i * 11} y="148" width="8" height="12" rx="2" fill="hsl(var(--border))" />
        ))}
      </svg>
    </div>
  )
}
