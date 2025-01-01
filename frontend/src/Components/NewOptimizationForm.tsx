import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Card } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Upload } from 'lucide-react';
import axiosInstance from '@/utils/axios';

interface Model {
  id: string;
  name: string;
  version: string;
}

interface NewOptimizationFormProps {
  selectedModel: Model | null;
  onSubmit: (response: any) => void;
}

export default function NewOptimizationForm({
  selectedModel,
  onSubmit,
}: NewOptimizationFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optimizationName, setOptimizationName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !selectedModel || !optimizationName.trim()) {
      alert('Please ensure a file is selected, a model is chosen, and name is provided.');
      return;
    }

    const allowedExtensions = ['xlsx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension || '')) {
      alert('Please upload a valid .xlsx file.');
      return;
    }

    const formData = new FormData();
    formData.append('input', file);
    formData.append('name', optimizationName.trim());

    try {
      setIsSubmitting(true);
      for (let pair of formData.entries()) {
        console.log('FormData content:', pair[0], pair[1]);
      }
      const response = await axiosInstance.post(
        `/models/550e8400-e29b-41d4-a716-446655440005/invoke`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 60000,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 100)
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          }
        }
      );

      console.log('Response:', response.data);
      onSubmit(response.data);
      alert('Optimization started successfully!');
    } catch (error: any) {
      console.error('Error starting optimization:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 403) {
          alert('Access denied: You do not have permission to perform this action.');
        } else if (status === 500) {
          alert(`Server error: ${data?.message || 'Internal Server Error'}`);
        } else {
          alert(`Error: ${data?.message || 'An unknown error occurred.'}`);
        }
      } else {
        alert('Network error: Unable to connect to the server.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">New Optimization</h2>
          <p className="text-gray-500 mb-4">
            Upload your .xlsx file to invoke the selected optimization model.
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

            {/* Optimization Name Input */}
            <div>
              <Label htmlFor="optimization-name">Optimization Name</Label>
              <div className="mt-1">
                <Input
                  id="optimization-name"
                  type="text"
                  value={optimizationName}
                  onChange={(e) => setOptimizationName(e.target.value)}
                  placeholder="Enter optimization name"
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <Label htmlFor="file">Input File (.xlsx)</Label>
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
                    accept=".xlsx"
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
            disabled={!file || !selectedModel || !optimizationName.trim() || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Send'}
          </Button>
        </div>
      </form>
    </Card>
  );
}