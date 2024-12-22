// src/Components/NewOptimizationForm.tsx
/*import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card } from '@/Components/ui/card';
import { Upload } from 'lucide-react';

interface Model {
  id: string;
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
}*/

// src/Components/NewOptimizationForm.tsx

 import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card } from '@/Components/ui/card';
import { Upload } from 'lucide-react';
import axiosInstance from '@/utils/axios';

interface Model {
  id: string;
  name: string;
  version: string;
}

interface NewOptimizationFormProps {
  selectedModel: Model | null;
  onSubmitSuccess: (response: any) => void; // Callback to notify parent on success
}

export default function NewOptimizationForm({
  selectedModel,
  onSubmitSuccess,
}: NewOptimizationFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [chatName, setChatName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !chatName || !selectedModel) {
      alert('Please ensure all fields are filled out.');
      return;
    }

    const formData = new FormData();
    formData.append('input', file); // Attach file with key 'input'

    try {
      setIsSubmitting(true);

      // Send the FormData to the backend
      const response = await axiosInstance.post(
        `/models/550e8400-e29b-41d4-a716-446655440004/invoke`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Handle response
      onSubmitSuccess(response.data); // Notify parent of success
      alert('Optimization started successfully!');
    } catch (error: any) {
      console.error('Error starting optimization:', error?.response?.data || error.message);
      alert('There was an error starting the optimization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">New Chat</h2>
          <p className="text-gray-500 mb-4">
            Upload your input file to invoke the selected optimization model.
          </p>
          <div className="space-y-4">
            {/* Selected Model Display */}
            <div>
              <Label>Model</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {selectedModel ? (
                  <p>
                    {selectedModel.name} - {selectedModel.version}
                  </p>
                ) : (
                  <p className="text-gray-500">No model selected</p>
                )}
              </div>
            </div>

            {/* Chat Name Input */}
            <div>
              <Label htmlFor="chatName">Chat Name</Label>
              <Input
                id="chatName"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="Enter a chat name"
                className="mt-1"
              />
            </div>

            {/* File Upload */}
            <div>
              <Label htmlFor="file">Input File</Label>
              <div className="mt-1">
                <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                  <span className="flex items-center space-x-2">
                    <Upload className="w-6 h-6 text-gray-600" />
                    <span className="font-medium text-gray-600">
                      {file ? file.name : 'Drop files to attach, or browse'}
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={!file || !chatName || !selectedModel || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Send'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

