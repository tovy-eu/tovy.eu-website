export function SectionDivider() {
  return (
    <div className="w-full">
      <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" style={{
        background: 'linear-gradient(to right, transparent, hsl(var(--primary)), #8F668C, transparent)'
      }}></div>
    </div>
  );
}
