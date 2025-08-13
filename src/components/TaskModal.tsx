import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Priority, Recurring, Task } from '@/types';

const TaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  assignee: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  recurring: z.enum(['daily', 'weekly', 'monthly']).nullable().optional(),
});

type TaskFormValues = z.infer<typeof TaskSchema>;

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Task;
  onSubmit: (values: TaskFormValues) => void;
  onDelete?: () => void;
}

export function TaskModal({ open, onOpenChange, initial, onSubmit, onDelete }: TaskModalProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: initial?.title || '',
      assignee: initial?.assignee || '',
      priority: initial?.priority || 'medium',
      recurring: (initial?.recurring as Recurring) || null,
    },
  });

  React.useEffect(() => {
    form.reset({
      title: initial?.title || '',
      assignee: initial?.assignee || '',
      priority: (initial?.priority as Priority) || 'medium',
      recurring: (initial?.recurring as Recurring) || null,
    });
  }, [initial]);

  const submit = (values: TaskFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Task' : 'Add Task'}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
          </div>
          <div>
            <Label htmlFor="assignee">Assignee</Label>
            <Input id="assignee" {...form.register('assignee')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select
                value={form.watch('priority')}
                onValueChange={(v: Priority) => form.setValue('priority', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Recurring</Label>
              <Select
                value={form.watch('recurring') ?? ''}
                onValueChange={(v: any) => form.setValue('recurring', v || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="One-time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">One-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            {onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
            <div className="ml-auto">
              <Button type="submit">Save</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
