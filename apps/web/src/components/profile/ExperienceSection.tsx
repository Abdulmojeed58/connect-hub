import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AddExperienceDialog } from '@/components/profile/AddExperienceDialog';
import { ExperienceCard } from '@/components/profile/ExperienceCard';
import type { Experience } from '@connecthub/shared-types';

export function ExperienceSection({
  experiences,
  userId,
  isOwnProfile,
}: {
  experiences: Experience[];
  userId: string;
  isOwnProfile: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Experience</CardTitle>
        {isOwnProfile && <AddExperienceDialog userId={userId} />}
      </CardHeader>
      <CardContent>
        {experiences.length === 0 ? (
          <p className="text-sm text-muted-foreground">No experience added yet.</p>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={exp.id}>
                <ExperienceCard exp={exp} />
                {i < experiences.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
