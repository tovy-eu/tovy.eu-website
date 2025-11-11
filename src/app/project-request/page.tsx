
import type { Metadata } from 'next';
import { ProjectIntakeForm } from '@/components/landing/project-intake-form';
import { WavyLines } from '@/components/landing/wavy-lines';

export const metadata: Metadata = {
  title: 'Start Your AI Project | Tovy AI',
  description: 'Share your project idea with Tovy AI and let\'s build the future together.',
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
