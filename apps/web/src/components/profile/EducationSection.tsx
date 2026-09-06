import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AddEducationDialog } from '@/components/profile/AddEducationDialog';
import { EducationCard } from '@/components/profile/EducationCard';
import type { Education } from '@connecthub/shared-types';

export function EducationSection({
  educations,
  userId,
  isOwnProfile,
}: {
  educations: Education[];
  userId: string;
  isOwnProfile: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Education</CardTitle>
        {isOwnProfile && <AddEducationDialog userId={userId} />}
      </CardHeader>
      <CardContent>
        {educations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No education added yet.</p>
        ) : (
          <div className="space-y-4">
            {educations.map((edu, i) => (
              <div key={edu.id}>
                <EducationCard edu={edu} />
                {i < educations.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
