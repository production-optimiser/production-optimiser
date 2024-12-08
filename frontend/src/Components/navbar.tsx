import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { PanelLeftIcon, ChevronRight, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface AppLayoutProps {
  children?: React.ReactNode;
}

interface NewChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewChatDialog: React.FC<NewChatDialogProps> = ({ isOpen, onClose }) => {
  const [chatName, setChatName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    // Handle chat creation
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New chat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Here you are sending wanted data to the selected model (change text?)
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Model</label>
              <Input value="Python 1 - v3.4.2" disabled />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Chat Name</label>
              <Input
                placeholder="New chat placeholder"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Input File</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  Choose File
                </Button>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <span className="text-sm text-gray-500 my-auto">
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Send</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MainContent: React.FC = () => {
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h2 className="text-xl mb-4">Select old chat or start a new one here</h2>
      <Button
        onClick={() => setShowNewChatDialog(true)}
        className="flex items-center gap-2"
      >
        <PlusCircle className="w-4 h-4" />
        Start new
      </Button>

      <NewChatDialog
        isOpen={showNewChatDialog}
        onClose={() => setShowNewChatDialog(false)}
      />
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
