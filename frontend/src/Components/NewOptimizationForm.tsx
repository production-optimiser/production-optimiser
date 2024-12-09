// src/Components/NewOptimizationForm.tsx
import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card } from '@/Components/ui/card';
import { Upload } from 'lucide-react';

interface Model {
  name: string;
  version: string;
}

interface NewOptimizationFormProps {
  selectedModel: Model | null;
  onSubmit: (data: FormData) => void;
}

export default function NewOptimizationForm({ selectedModel, onSubmit }: NewOptimizationFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('modelName', selectedModel?.name || '');
    formData.append('modelVersion', selectedModel?.version || '');

    onSubmit(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">Start a new optimization</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Selected Model</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {selectedModel ? (
                  <p>{selectedModel.name} - {selectedModel.version}</p>
                ) : (
                  <p className="text-gray-500">No model selected</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Optimization Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a name for this optimization"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="file">Upload File</Label>
              <div className="mt-1">
                <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                  <span className="flex items-center space-x-2">
                    <Upload className="w-6 h-6 text-gray-600" />
                    <span className="font-medium text-gray-600">
                      {file ? file.name : 'Drop files to Attach, or browse'}
                    </span>
                  </span>
                  <input
                    type="file"
                    id="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!file || !title || !selectedModel}
          >
            Start Optimization
          </Button>
        </div>
      </form>
    </Card>
  );
}
