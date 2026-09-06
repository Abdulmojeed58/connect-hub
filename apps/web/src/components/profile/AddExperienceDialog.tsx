import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAddExperience } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function AddExperienceDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAddExperience(userId);
  const [form, setForm] = useState({ company: '', title: '', startDate: '', endDate: '', description: '' });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleAdd = () => {
    if (!form.company || !form.title || !form.startDate) return;
    mutate(
      {
        company: form.company,
        title: form.title,
        startDate: new Date(form.startDate).toISOString(),
        ...(form.endDate && { endDate: new Date(form.endDate).toISOString() }),
        ...(form.description && { description: form.description }),
      },
      { onSuccess: () => { setOpen(false); setForm({ company: '', title: '', startDate: '', endDate: '', description: '' }); } },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" />Add experience</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add experience</DialogTitle></DialogHeader>
        <div className="space-y-3 pt-2">
          {[
            { id: 'title', label: 'Title', type: 'text' },
            { id: 'company', label: 'Company', type: 'text' },
            { id: 'startDate', label: 'Start date', type: 'date' },
            { id: 'endDate', label: 'End date (leave blank if current)', type: 'date' },
          ].map(({ id, label, type }) => (
            <div key={id} className="space-y-1.5">
              <Label htmlFor={id}>{label}</Label>
              <Input id={id} type={type} value={form[id as keyof typeof form]} onChange={set(id as keyof typeof form)} />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label htmlFor="exp-desc">Description</Label>
            <Textarea id="exp-desc" rows={2} value={form.description} onChange={set('description')} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={isPending}>{isPending ? 'Adding…' : 'Add'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
