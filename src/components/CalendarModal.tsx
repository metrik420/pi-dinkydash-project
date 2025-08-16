import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { CalendarEvent } from '@/types';

const calendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  start: z.string().min(1, 'Start time is required'),
  end: z.string().min(1, 'End time is required'),
  description: z.string().optional(),
});

type CalendarEventForm = z.infer<typeof calendarEventSchema>;

interface CalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: CalendarEvent;
  onSubmit: (values: CalendarEventForm) => void;
  onDelete?: () => void;
}

export const CalendarModal = ({ open, onOpenChange, initial, onSubmit, onDelete }: CalendarModalProps) => {
  const form = useForm<CalendarEventForm>({
    resolver: zodResolver(calendarEventSchema),
    defaultValues: {
      title: initial?.title || '',
      start: initial?.start || '',
      end: initial?.end || '',
      description: initial?.description || '',
    },
  });

  const handleSubmit = (values: CalendarEventForm) => {
    onSubmit(values);
    onOpenChange(false);
    form.reset();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Event description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              {onDelete && (
                <Button type="button" variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              )}
              <div className="flex-1" />
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {initial ? 'Update' : 'Add'} Event
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};