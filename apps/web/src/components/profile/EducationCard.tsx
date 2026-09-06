import { GraduationCap } from 'lucide-react';
import type { Education } from '@connecthub/shared-types';

export function EducationCard({ edu }: { edu: Education }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <GraduationCap className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium">{edu.school}</p>
        <p className="text-sm text-muted-foreground">{edu.degree} in {edu.field}</p>
        <p className="text-xs text-muted-foreground">{edu.year}</p>
      </div>
    </div>
  );
}
