export function SectionDivider() {
  return (
    <div className="flex justify-center my-12 sm:my-16">
      <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent" style={{
        background: 'linear-gradient(to right, transparent, hsl(var(--primary)), #8F668C, transparent)'
      }}></div>
    </div>
  );
}
