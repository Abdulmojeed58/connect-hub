import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAddEducation } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function AddEducationDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAddEducation(userId);
  const [form, setForm] = useState({ school: '', degree: '', field: '', year: '' });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleAdd = () => {
    if (!form.school || !form.degree || !form.field || !form.year) return;
    mutate(
      { school: form.school, degree: form.degree, field: form.field, year: parseInt(form.year, 10) },
      {
        onSuccess: () => {
          setOpen(false);
          setForm({ school: '', degree: '', field: '', year: '' });
          toast.success('Education added');
        },
        onError: () => toast.error('Failed to add education'),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" />Add education</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add education</DialogTitle></DialogHeader>
        <div className="space-y-3 pt-2">
          {[
            { id: 'school', label: 'School' },
            { id: 'degree', label: 'Degree' },
            { id: 'field', label: 'Field of study' },
            { id: 'year', label: 'Graduation year' },
          ].map(({ id, label }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id}>{label}</Label>
              <Input id={id} type={id === 'year' ? 'number' : 'text'} value={form[id as keyof typeof form]} onChange={set(id as keyof typeof form)} />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={isPending}>{isPending ? 'Adding…' : 'Add'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
