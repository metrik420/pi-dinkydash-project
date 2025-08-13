import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { EventItem } from '@/types';

const EventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.date(),
  emoji: z.string().min(1).max(4),
  color: z.string().optional(),
});

type EventFormValues = z.infer<typeof EventSchema>;

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: EventItem;
  onSubmit: (values: { name: string; dateISO: string; emoji: string; color?: string }) => void;
  onDelete?: () => void;
}

export function EventModal({ open, onOpenChange, initial, onSubmit, onDelete }: EventModalProps) {
  const [openCal, setOpenCal] = React.useState(false);
  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: initial?.name || '',
      date: initial?.dateISO ? new Date(initial.dateISO) : new Date(),
      emoji: initial?.emoji || '🎉',
      color: initial?.color || '#06b6d4',
    },
  });

  React.useEffect(() => {
    form.reset({
      name: initial?.name || '',
      date: initial?.dateISO ? new Date(initial.dateISO) : new Date(),
      emoji: initial?.emoji || '🎉',
      color: initial?.color || '#06b6d4',
    });
  }, [initial]);

  const submit = (values: EventFormValues) => {
    const payload = {
      name: values.name,
      dateISO: values.date.toISOString().slice(0, 10),
      emoji: values.emoji,
      color: values.color,
    };
    onSubmit(payload);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Popover open={openCal} onOpenChange={setOpenCal}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('date').toDateString()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch('date')}
                    onSelect={(d) => d && form.setValue('date', d)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="emoji">Emoji</Label>
              <Input id="emoji" {...form.register('emoji')} />
            </div>
          </div>
          <div>
            <Label htmlFor="color">Color (hex)</Label>
            <Input id="color" type="color" {...form.register('color')} />
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
