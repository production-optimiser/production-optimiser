import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LinkModelDialog = ({ isOpen, onClose, onSubmit }) => {
  const [modelName, setModelName] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  const [inputType, setInputType] = useState('');

  const handleSubmit = () => {
    onSubmit({
      name: modelName,
      url: modelUrl,
      inputType: inputType
    });
    // Reset form
    setModelName('');
    setModelUrl('');
    setInputType('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Model</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter model name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">URL</label>
            <Input
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              placeholder="Enter model URL"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Input Type</label>
            <Select value={inputType} onValueChange={setInputType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select input type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="file">File</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={!modelName || !modelUrl || !inputType}
          >
            Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkModelDialog;