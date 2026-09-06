import { Briefcase } from 'lucide-react';
import type { Experience } from '@connecthub/shared-types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Briefcase className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">{exp.title}</p>
        <p className="text-sm text-muted-foreground">{exp.company}</p>
        <p className="text-xs text-muted-foreground">{formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}</p>
        {exp.description && <p className="mt-1 text-sm text-muted-foreground">{exp.description}</p>}
      </div>
    </div>
  );
}
