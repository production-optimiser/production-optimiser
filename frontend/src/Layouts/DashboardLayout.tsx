import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Copy } from "lucide-react";

interface OptimizationItem {
  title: string;
  isDisabled?: boolean;
}

interface TimeSection {
  title: string;
  items: OptimizationItem[];
}

interface SidebarNavProps {
  modelName?: string;
  modelVersion?: string;
  sections?: TimeSection[];
}

const defaultSections: TimeSection[] = [
  {
    title: "Today",
    items: [
      { title: "Candy Optimization" },
      { title: "Plane engine optimization" }
    ]
  },
  {
    title: "Last 7 days",
    items: Array(10).fill(null).map(() => ({ 
      title: "Test optimization"
    }))
  },
  {
    title: "Last 30 days",
    items: Array(5).fill(null).map(() => ({ 
      title: "Older optimization",
      isDisabled: true
    }))
  }
];

const Layout: React.FC<SidebarNavProps> = ({
  modelName = "Python 1",
  modelVersion = "v3.4.2",
  sections = defaultSections
}) => {
  return (
    <Card className="w-64 h-screen">
      <div className="p-4 border-b">
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-200 rounded flex items-center justify-center">
              <Copy className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">
              {modelName} - {modelVersion}
            </span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4">
          <div className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h2 className="text-sm font-medium mb-2">{section.title}</h2>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <Button
                      key={itemIndex}
                      variant="ghost"
                      className={`w-full justify-start text-sm ${
                        item.isDisabled ? 'text-gray-500' : ''
                      }`}
                      disabled={item.isDisabled}
                    >
                      {item.title}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default Layout;