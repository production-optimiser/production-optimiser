import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PanelLeftIcon, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AppLayoutProps {
  children?: React.ReactNode;
}

const MainContent: React.FC = () => {
  // Generate a grid of skeleton cards for the loading state
  const skeletonCards = Array(6).fill(null).map((_, i) => (
    <div key={i} className="bg-card rounded-lg p-6">
      <Skeleton className="w-full h-48 mb-4" />
      <Skeleton className="w-3/4 h-4 mb-2" />
      <Skeleton className="w-1/2 h-4" />
    </div>
  ));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletonCards}
    </div>
  );
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background">
      {children}
      
      <div className="flex-1 flex flex-col">
        {/* Header Navigation */}
        <header className="border-b">
          <div className="flex h-14 items-center px-4 gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <PanelLeftIcon className="h-6 w-6" />
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Your optimizations</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">New Optimization</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
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
