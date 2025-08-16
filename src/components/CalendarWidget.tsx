import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, RefreshCcw, Link, Unlink } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarModal } from '@/components/CalendarModal';
import { initGoogleCalendar, signInToGoogle, signOutFromGoogle, fetchGoogleCalendarEvents } from '@/services/calendar';
import { toast } from '@/hooks/use-toast';
import type { CalendarEvent } from '@/types';

export const CalendarWidget = () => {
  const calendarEvents = useDashboardStore((s) => s.calendarEvents);
  const googleCalendarConnected = useDashboardStore((s) => s.googleCalendarConnected);
  const addCalendarEvent = useDashboardStore((s) => s.addCalendarEvent);
  const setGoogleCalendarConnected = useDashboardStore((s) => s.setGoogleCalendarConnected);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Initialize Google Calendar API on component mount
    initGoogleCalendar();
  }, []);

  const todaysEvents = calendarEvents.filter(event => {
    const eventDate = new Date(event.start);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });

  const selectedDateEvents = selectedDate ? calendarEvents.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === selectedDate.toDateString();
  }) : [];

  const handleGoogleCalendarConnect = async () => {
    setIsConnecting(true);
    try {
      const initialized = await initGoogleCalendar();
      if (!initialized) {
        toast({
          title: 'Setup Required',
          description: 'Please add VITE_GOOGLE_API_KEY and VITE_GOOGLE_CLIENT_ID to environment variables.',
          variant: 'destructive'
        });
        return;
      }

      const signedIn = await signInToGoogle();
      if (signedIn) {
        setGoogleCalendarConnected(true);
        await syncGoogleCalendarEvents();
        toast({ title: 'Connected!', description: 'Google Calendar connected successfully.' });
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to Google Calendar. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGoogleCalendarDisconnect = async () => {
    try {
      await signOutFromGoogle();
      setGoogleCalendarConnected(false);
      toast({ title: 'Disconnected', description: 'Google Calendar disconnected.' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect Google Calendar.',
        variant: 'destructive'
      });
    }
  };

  const syncGoogleCalendarEvents = async () => {
    try {
      const googleEvents = await fetchGoogleCalendarEvents();
      googleEvents.forEach(event => {
        const startTime = event.start.dateTime || event.start.date || '';
        const endTime = event.end.dateTime || event.end.date || '';
        
        addCalendarEvent({
          title: event.summary || 'Untitled Event',
          start: startTime,
          end: endTime,
          description: event.description,
          source: 'google'
        });
      });
      
      toast({ title: 'Synced!', description: `${googleEvents.length} events imported from Google Calendar.` });
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: 'Failed to sync Google Calendar events.',
        variant: 'destructive'
      });
    }
  };

  const editingEvent = calendarEvents.find(e => e.id === editingEventId);

  return (
    <div className="widget">
      <div className="flex items-center justify-between mb-4">
        <div className="widget-title flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" /> Calendar
        </div>
        <div className="flex items-center gap-2">
          {googleCalendarConnected ? (
            <>
              <Button size="sm" variant="secondary" onClick={syncGoogleCalendarEvents}>
                <RefreshCcw className="h-4 w-4 mr-1" /> Sync
              </Button>
              <Button size="sm" variant="outline" onClick={handleGoogleCalendarDisconnect}>
                <Unlink className="h-4 w-4 mr-1" /> Disconnect
              </Button>
            </>
          ) : (
            <Button size="sm" variant="secondary" onClick={handleGoogleCalendarConnect} disabled={isConnecting}>
              <Link className="h-4 w-4 mr-1" /> {isConnecting ? 'Connecting...' : 'Connect Gmail'}
            </Button>
          )}
          <Button size="sm" onClick={() => { setEditingEventId(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Calendar */}
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>

        {/* Events List */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Today's Events</h4>
            {todaysEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events today</p>
            ) : (
              <div className="space-y-2">
                {todaysEvents.map(event => (
                  <div key={event.id} className="p-2 bg-secondary/50 rounded-md">
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {event.source === 'google' && ' (Gmail)'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedDate && selectedDateEvents.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">
                Events on {selectedDate.toLocaleDateString()}
              </h4>
              <div className="space-y-2">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="p-2 bg-secondary/50 rounded-md cursor-pointer"
                       onClick={() => { setEditingEventId(event.id); setModalOpen(true); }}>
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {event.source === 'google' && ' (Gmail)'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <CalendarModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editingEvent}
        onSubmit={(values) => {
          if (editingEventId) {
            // Update functionality would go here
          } else {
            addCalendarEvent({
              title: values.title,
              start: values.start,
              end: values.end,
              description: values.description,
              source: 'local'
            });
          }
        }}
        onDelete={editingEventId ? () => {
          // Delete functionality would go here
          setModalOpen(false);
        } : undefined}
      />
    </div>
  );
};