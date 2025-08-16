import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardStore } from '@/store/dashboard';
import { ApiKeySettings } from '@/components/ApiKeySettings';

export function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const city = useDashboardStore((s) => s.city);
  const setCity = useDashboardStore((s) => s.setCity);
  const theme = useDashboardStore((s) => s.theme);
  const setTheme = useDashboardStore((s) => s.setTheme);
  const toggles = useDashboardStore((s) => s.toggles);
  const setToggles = useDashboardStore((s) => s.setToggles);
  const family = useDashboardStore((s) => s.family);
  const addFamily = useDashboardStore((s) => s.addFamily);
  const updateFamily = useDashboardStore((s) => s.updateFamily);
  const deleteFamily = useDashboardStore((s) => s.deleteFamily);

  const [tmpCity, setTmpCity] = React.useState(city);
  React.useEffect(() => setTmpCity(city), [city]);

  React.useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    if (theme === 'light') document.documentElement.classList.remove('dark');
    if (theme === 'auto') {
      document.documentElement.classList.toggle('dark', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, [theme]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="location">
           <TabsList>
             <TabsTrigger value="location">Location</TabsTrigger>
             <TabsTrigger value="family">Family</TabsTrigger>
             <TabsTrigger value="appearance">Appearance</TabsTrigger>
             <TabsTrigger value="features">Features</TabsTrigger>
             <TabsTrigger value="api">API Keys</TabsTrigger>
           </TabsList>
          <TabsContent value="location" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="city">Weather City</Label>
              <div className="flex gap-2 mt-1">
                <Input id="city" value={tmpCity} onChange={(e) => setTmpCity(e.target.value)} />
                <Button onClick={() => setCity(tmpCity)}>Save</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="family" className="space-y-4 mt-4">
            <FamilyEditor />
          </TabsContent>
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div>
              <Label>Theme</Label>
              <Select value={theme} onValueChange={(v: any) => setTheme(v)}>
                <SelectTrigger className="mt-1 w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
           <TabsContent value="features" className="space-y-4 mt-4">
             <div className="flex items-center justify-between">
               <span>Weather</span>
               <Switch checked={toggles.showWeather} onCheckedChange={(v) => setToggles({ ...toggles, showWeather: v })} />
             </div>
             <div className="flex items-center justify-between">
               <span>Tasks</span>
               <Switch checked={toggles.showTasks} onCheckedChange={(v) => setToggles({ ...toggles, showTasks: v })} />
             </div>
             <div className="flex items-center justify-between">
               <span>Countdowns</span>
               <Switch checked={toggles.showEvents} onCheckedChange={(v) => setToggles({ ...toggles, showEvents: v })} />
             </div>
             <div className="flex items-center justify-between">
               <span>Calendar</span>
               <Switch checked={toggles.showCalendar} onCheckedChange={(v) => setToggles({ ...toggles, showCalendar: v })} />
             </div>
             <div className="flex items-center justify-between">
               <span>Fun Facts</span>
               <Switch checked={toggles.showFunFacts} onCheckedChange={(v) => setToggles({ ...toggles, showFunFacts: v })} />
             </div>
             <div className="flex items-center justify-between">
               <span>System Status</span>
               <Switch checked={toggles.showSystem} onCheckedChange={(v) => setToggles({ ...toggles, showSystem: v })} />
             </div>
           </TabsContent>
           <TabsContent value="api" className="space-y-4 mt-4">
             <ApiKeySettings />
           </TabsContent>
         </Tabs>
       </DialogContent>
     </Dialog>
   );
 }

function FamilyEditor() {
  const family = useDashboardStore((s) => s.family);
  const addFamily = useDashboardStore((s) => s.addFamily);
  const updateFamily = useDashboardStore((s) => s.updateFamily);
  const deleteFamily = useDashboardStore((s) => s.deleteFamily);
  const [name, setName] = React.useState('');
  const [avatarUrl, setAvatarUrl] = React.useState('');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="col-span-2">
          <Label>Avatar URL</Label>
          <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
        </div>
      </div>
      <Button onClick={() => { if (name.trim()) { addFamily({ name, avatarUrl }); setName(''); setAvatarUrl(''); } }}>Add Member</Button>

      <div className="space-y-3">
        {family.map((m) => (
          <div key={m.id} className="flex items-center gap-3 p-2 rounded-md border">
            <img src={m.avatarUrl || '/placeholder.svg'} alt={`${m.name} avatar`} className="h-10 w-10 rounded-full object-cover" />
            <Input className="max-w-[180px]" value={m.name} onChange={(e) => updateFamily(m.id, { name: e.target.value })} />
            <Input value={m.avatarUrl || ''} onChange={(e) => updateFamily(m.id, { avatarUrl: e.target.value })} />
            <Button variant="destructive" onClick={() => deleteFamily(m.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
