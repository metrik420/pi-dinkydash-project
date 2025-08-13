import { useEffect } from 'react';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  useEffect(() => {
    document.title = 'Family Dashboard - Smart Home Organizer';
    const meta = document.querySelector('meta[name="description"]');
    const content = 'Family Dashboard with persistent tasks and live weather.';
    if (meta) meta.setAttribute('content', content);
    else {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = content;
      document.head.appendChild(m);
    }
  }, []);
  return <Dashboard />;
};

export default Index;
