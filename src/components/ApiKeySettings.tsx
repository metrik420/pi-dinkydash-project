import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

export function ApiKeySettings() {
  const [weatherKey, setWeatherKey] = React.useState(localStorage.getItem('weatherApiKey') || '');
  const [googleKey, setGoogleKey] = React.useState(localStorage.getItem('googleApiKey') || '');
  const [googleClientId, setGoogleClientId] = React.useState(localStorage.getItem('googleClientId') || '');
  const [showKeys, setShowKeys] = React.useState(false);

  const saveWeatherKey = () => {
    localStorage.setItem('weatherApiKey', weatherKey);
    window.location.reload(); // Refresh to use new key
  };

  const saveGoogleKeys = () => {
    localStorage.setItem('googleApiKey', googleKey);
    localStorage.setItem('googleClientId', googleClientId);
    window.location.reload(); // Refresh to use new keys
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weather API</CardTitle>
          <CardDescription>
            Get a free API key from{' '}
            <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              OpenWeatherMap
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="weather-key">API Key</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="weather-key"
                type={showKeys ? 'text' : 'password'}
                value={weatherKey}
                onChange={(e) => setWeatherKey(e.target.value)}
                placeholder="Enter your OpenWeatherMap API key"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowKeys(!showKeys)}
              >
                {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button onClick={saveWeatherKey}>Save</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Google Calendar</CardTitle>
          <CardDescription>
            Setup Google Calendar integration by creating credentials in{' '}
            <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Google Cloud Console
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="google-key">API Key</Label>
            <Input
              id="google-key"
              type={showKeys ? 'text' : 'password'}
              value={googleKey}
              onChange={(e) => setGoogleKey(e.target.value)}
              placeholder="Enter your Google API key"
            />
          </div>
          <div>
            <Label htmlFor="google-client-id">Client ID</Label>
            <Input
              id="google-client-id"
              type={showKeys ? 'text' : 'password'}
              value={googleClientId}
              onChange={(e) => setGoogleClientId(e.target.value)}
              placeholder="Enter your Google OAuth Client ID"
            />
          </div>
          <Button onClick={saveGoogleKeys}>Save Google Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}