// navbar.tsx
import React from 'react';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { PanelLeftIcon, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/Components/ui/skeleton';
import OptimizationResultsDashboard from './optimizationResult';


interface AppLayoutProps {
  children?: React.ReactNode;
}

const MainContent: React.FC = () => {
  return (
    <div className="w-full">
      <OptimizationResultsDashboard />
    </div>
  );
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const handleSidebarToggle = () => {
    // Sidebar toggle logic
  };

  return (
    <div className="flex h-screen bg-background">
      {children}
      <div className="flex-1 flex flex-col">
        <header className="border-b">
          <div className="flex h-14 items-center px-4 gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={handleSidebarToggle}
            >
              <PanelLeftIcon className="h-6 w-6" />
            </Button>
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Your optimizations</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">New Optimization</span>
            </nav>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <MainContent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;