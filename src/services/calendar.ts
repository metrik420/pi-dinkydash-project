interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  description?: string;
}

export const initGoogleCalendar = async (): Promise<boolean> => {
  // Mock implementation - return true to simulate successful initialization
  console.log('Google Calendar initialization (mock mode)');
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

export const signInToGoogle = async (): Promise<boolean> => {
  // Mock sign in - simulate successful authentication
  console.log('Google sign in (mock mode)');
  await new Promise(resolve => setTimeout(resolve, 1500));
  return true;
};

export const signOutFromGoogle = async (): Promise<void> => {
  // Mock sign out
  console.log('Google sign out (mock mode)');
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const fetchGoogleCalendarEvents = async (): Promise<GoogleCalendarEvent[]> => {
  // Return mock calendar events
  console.log('Fetching Google Calendar events (mock mode)');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockEvents: GoogleCalendarEvent[] = [
    {
      id: 'mock-1',
      summary: 'Team Meeting',
      start: { dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString() },
      description: 'Weekly team sync meeting'
    },
    {
      id: 'mock-2', 
      summary: 'Doctor Appointment',
      start: { dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString() },
      description: 'Annual check-up'
    }
  ];
  
  return mockEvents;
};

const loadGoogleAPIs = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google APIs'));
    document.head.appendChild(script);
  });
};

// Type declaration for global gapi
declare global {
  interface Window {
    gapi: any;
  }
}