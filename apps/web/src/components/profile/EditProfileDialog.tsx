import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useUpdateProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { FullProfile } from '@connecthub/shared-types';

export function EditProfileDialog({ profile, userId }: { profile: FullProfile; userId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateProfile(userId);
  const [form, setForm] = useState({
    fullName: profile.fullName,
    headline: profile.headline ?? '',
    bio: profile.bio ?? '',
    location: profile.location ?? '',
    photoUrl: profile.photoUrl ?? '',
  });

  const handleSave = () => {
    mutate(
      {
        ...(form.fullName && { fullName: form.fullName }),
        ...(form.headline && { headline: form.headline }),
        ...(form.bio && { bio: form.bio }),
        ...(form.location && { location: form.location }),
        ...(form.photoUrl && { photoUrl: form.photoUrl }),
      },
      { onSuccess: () => setOpen(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit profile</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          {(['fullName', 'headline', 'location', 'photoUrl'] as const).map((field) => (
            <div key={field} className="space-y-1.5">
              <Label htmlFor={field} className="capitalize">
                {field === 'photoUrl' ? 'Photo URL' : field === 'fullName' ? 'Full name' : field}
              </Label>
              <Input id={field} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isPending}>{isPending ? 'Saving…' : 'Save'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
