
import type { Metadata } from 'next';
import { ProjectIntakeForm } from '@/components/landing/project-intake-form';
import { WavyLines } from '@/components/landing/wavy-lines';

export const metadata: Metadata = {
  title: 'Start Your AI Project | Tovy',
  description: 'Share your project details with Tovy to build clean, fast, and reliable AI systems that turn manual labor into cognitive freedom.',
};

export default function ProjectRequestPage() {
  return (
    <div 
      className="relative flex min-h-screen flex-col items-center justify-center py-12 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div className="container z-10">
        <ProjectIntakeForm />
      </div>
    </div>
  );
}
