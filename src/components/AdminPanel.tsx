import { useState } from 'react';
import { Settings, Eye, EyeOff, GripVertical, Monitor, Thermometer, CheckSquare, Calendar, Lightbulb, Zap } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WidgetLayout } from '@/types';

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const widgetIcons = {
  weather: Thermometer,
  tasks: CheckSquare,
  events: Calendar,
  calendar: Calendar,
  funfacts: Lightbulb,
  system: Zap,
};

const widgetNames = {
  weather: 'Weather',
  tasks: 'Tasks',
  events: 'Events',
  calendar: 'Calendar',
  funfacts: 'Fun Facts',
  system: 'System Status',
};

export const AdminPanel = ({ open, onOpenChange }: AdminPanelProps) => {
  const widgetLayout = useDashboardStore((s) => s.widgetLayout);
  const updateWidget = useDashboardStore((s) => s.updateWidget);
  const updateWidgetLayout = useDashboardStore((s) => s.updateWidgetLayout);
  const toggles = useDashboardStore((s) => s.toggles);
  const setToggles = useDashboardStore((s) => s.setToggles);

  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const handleWidgetToggle = (widgetId: string, enabled: boolean) => {
    updateWidget(widgetId, { enabled });
    
    // Update feature toggles accordingly
    const widget = widgetLayout.find(w => w.id === widgetId);
    if (widget) {
      switch (widget.type) {
        case 'weather':
          setToggles({ showWeather: enabled });
          break;
        case 'tasks':
          setToggles({ showTasks: enabled });
          break;
        case 'events':
          setToggles({ showEvents: enabled });
          break;
        case 'calendar':
          setToggles({ showCalendar: enabled });
          break;
        case 'funfacts':
          setToggles({ showFunFacts: enabled });
          break;
        case 'system':
          setToggles({ showSystem: enabled });
          break;
      }
    }
  };

  const handleSizeChange = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    updateWidget(widgetId, { size });
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault();
    
    if (!draggedWidget || draggedWidget === targetWidgetId) return;

    const draggedIndex = widgetLayout.findIndex(w => w.id === draggedWidget);
    const targetIndex = widgetLayout.findIndex(w => w.id === targetWidgetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLayout = [...widgetLayout];
    const [draggedItem] = newLayout.splice(draggedIndex, 1);
    newLayout.splice(targetIndex, 0, draggedItem);

    // Update positions
    newLayout.forEach((widget, index) => {
      widget.position = index;
    });

    updateWidgetLayout(newLayout);
    setDraggedWidget(null);
  };

  const sortedWidgets = [...widgetLayout].sort((a, b) => a.position - b.position);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Panel
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="widgets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="widgets">Widget Management</TabsTrigger>
            <TabsTrigger value="layout">Layout & Display</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Widget Controls</h3>
              {sortedWidgets.map((widget) => {
                const IconComponent = widgetIcons[widget.type];
                return (
                  <Card 
                    key={widget.id}
                    className={`transition-all duration-200 ${draggedWidget === widget.id ? 'opacity-50' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, widget.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, widget.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          <IconComponent className="h-4 w-4" />
                          {widgetNames[widget.type]}
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={widget.enabled}
                            onCheckedChange={(enabled) => handleWidgetToggle(widget.id, enabled)}
                          />
                          {widget.enabled ? (
                            <Eye className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Size:</Label>
                          <Select 
                            value={widget.size} 
                            onValueChange={(size: 'small' | 'medium' | 'large') => handleSizeChange(widget.id, size)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Position: {widget.position + 1}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Display Settings</h3>
              
              <Card>
                <CardHeader>
                  <CardTitle>Global Features</CardTitle>
                  <CardDescription>Toggle main dashboard features on/off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      <Label>Weather Widget</Label>
                    </div>
                    <Switch 
                      checked={toggles.showWeather} 
                      onCheckedChange={(checked) => setToggles({ showWeather: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4" />
                      <Label>Tasks Widget</Label>
                    </div>
                    <Switch 
                      checked={toggles.showTasks} 
                      onCheckedChange={(checked) => setToggles({ showTasks: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <Label>Events Widget</Label>
                    </div>
                    <Switch 
                      checked={toggles.showEvents} 
                      onCheckedChange={(checked) => setToggles({ showEvents: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <Label>Calendar Widget</Label>
                    </div>
                    <Switch 
                      checked={toggles.showCalendar} 
                      onCheckedChange={(checked) => setToggles({ showCalendar: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <Label>Fun Facts Widget</Label>
                    </div>
                    <Switch 
                      checked={toggles.showFunFacts} 
                      onCheckedChange={(checked) => setToggles({ showFunFacts: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <Label>System Status Widget</Label>
                    </div>
                    <Switch 
                      checked={toggles.showSystem} 
                      onCheckedChange={(checked) => setToggles({ showSystem: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};