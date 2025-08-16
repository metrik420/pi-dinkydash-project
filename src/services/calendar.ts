interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  description?: string;
}

export const initGoogleCalendar = async (): Promise<boolean> => {
  try {
    // Check if Google APIs are loaded
    if (typeof window.gapi === 'undefined') {
      await loadGoogleAPIs();
    }

    await new Promise((resolve, reject) => {
      window.gapi.load('client:auth2', {
        callback: resolve,
        onerror: reject
      });
    });

    await window.gapi.client.init({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar.readonly'
    });

    return true;
  } catch (error) {
    console.error('Failed to initialize Google Calendar:', error);
    return false;
  }
};

export const signInToGoogle = async (): Promise<boolean> => {
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    return authInstance.isSignedIn.get();
  } catch (error) {
    console.error('Failed to sign in to Google:', error);
    return false;
  }
};

export const signOutFromGoogle = async (): Promise<void> => {
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
  } catch (error) {
    console.error('Failed to sign out from Google:', error);
  }
};

export const fetchGoogleCalendarEvents = async (): Promise<GoogleCalendarEvent[]> => {
  try {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      throw new Error('Not signed in to Google');
    }

    const response = await window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime'
    });

    return response.result.items || [];
  } catch (error) {
    console.error('Failed to fetch Google Calendar events:', error);
    return [];
  }
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