import { useState } from 'react';
import { GraduationCap, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateEducation, useDeleteEducation } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Education } from '@connecthub/shared-types';

export function EducationCard({
  edu,
  userId,
  isOwnProfile,
}: {
  edu: Education;
  userId: string;
  isOwnProfile: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({
    school: edu.school,
    degree: edu.degree,
    field: edu.field,
    year: String(edu.year),
  });

  const { mutate: update, isPending: updating } = useUpdateEducation(userId);
  const { mutate: remove, isPending: deleting } = useDeleteEducation(userId);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleUpdate = () => {
    if (!form.school || !form.degree || !form.field || !form.year) return;
    update(
      { id: edu.id, school: form.school, degree: form.degree, field: form.field, year: parseInt(form.year, 10) },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast.success('Education updated');
        },
        onError: () => toast.error('Failed to update education'),
      },
    );
  };

  const handleDelete = () => {
    remove(edu.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast.success('Education removed');
      },
      onError: () => toast.error('Failed to remove education'),
    });
  };

  return (
    <>
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{edu.school}</p>
          <p className="text-sm text-muted-foreground">{edu.degree} in {edu.field}</p>
          <p className="text-xs text-muted-foreground">{edu.year}</p>
        </div>
        {isOwnProfile && (
          <div className="flex shrink-0 items-start gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditOpen(true)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit education</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            {([
              { id: 'school', label: 'School' },
              { id: 'degree', label: 'Degree' },
              { id: 'field', label: 'Field of study' },
              { id: 'year', label: 'Graduation year' },
            ] as const).map(({ id, label }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={`edit-edu-${id}`}>{label}</Label>
                <Input id={`edit-edu-${id}`} type={id === 'year' ? 'number' : 'text'} value={form[id]} onChange={set(id)} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updating}>{updating ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove education</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove <span className="font-medium text-foreground">{edu.degree}</span> at{' '}
            <span className="font-medium text-foreground">{edu.school}</span>? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Removing…' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
