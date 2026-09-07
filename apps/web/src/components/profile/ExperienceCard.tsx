import { useState } from 'react';
import { Briefcase, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateExperience, useDeleteExperience } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Experience } from '@connecthub/shared-types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function toDateInput(iso: string) {
  return iso.slice(0, 10);
}

export function ExperienceCard({
  exp,
  userId,
  isOwnProfile,
}: {
  exp: Experience;
  userId: string;
  isOwnProfile: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({
    title: exp.title,
    company: exp.company,
    startDate: toDateInput(exp.startDate),
    endDate: exp.endDate ? toDateInput(exp.endDate) : '',
    description: exp.description ?? '',
  });

  const { mutate: update, isPending: updating } = useUpdateExperience(userId);
  const { mutate: remove, isPending: deleting } = useDeleteExperience(userId);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleUpdate = () => {
    if (!form.company || !form.title || !form.startDate) return;
    update(
      {
        id: exp.id,
        company: form.company,
        title: form.title,
        startDate: new Date(form.startDate).toISOString(),
        ...(form.endDate && { endDate: new Date(form.endDate).toISOString() }),
        ...(form.description && { description: form.description }),
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast.success('Experience updated');
        },
        onError: () => toast.error('Failed to update experience'),
      },
    );
  };

  const handleDelete = () => {
    remove(exp.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast.success('Experience removed');
      },
      onError: () => toast.error('Failed to remove experience'),
    });
  };

  return (
    <>
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{exp.title}</p>
          <p className="text-sm text-muted-foreground">{exp.company}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
          </p>
          {exp.description && <p className="mt-1 text-sm text-muted-foreground">{exp.description}</p>}
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
          <DialogHeader><DialogTitle>Edit experience</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            {([
              { id: 'title', label: 'Title', type: 'text' },
              { id: 'company', label: 'Company', type: 'text' },
              { id: 'startDate', label: 'Start date', type: 'date' },
              { id: 'endDate', label: 'End date (leave blank if current)', type: 'date' },
            ] as const).map(({ id, label, type }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={`edit-exp-${id}`}>{label}</Label>
                <Input id={`edit-exp-${id}`} type={type} value={form[id]} onChange={set(id)} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label htmlFor="edit-exp-desc">Description</Label>
              <Textarea id="edit-exp-desc" rows={2} value={form.description} onChange={set('description')} />
            </div>
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
          <DialogHeader><DialogTitle>Remove experience</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove <span className="font-medium text-foreground">{exp.title}</span> at{' '}
            <span className="font-medium text-foreground">{exp.company}</span>? This cannot be undone.
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
