import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import axiosInstance from '@/utils/axios';

interface Model {
  id: string;
  name: string;
  version: string;
  inputType: 'STRING' | 'FILE' | 'IMAGE';
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
  const [inputValue, setInputValue] = useState('');
  const [allowedExtensions, setAllowedExtensions] = useState<string[]>([]);
  const [modelDetails, setModelDetails] = useState<any>(null);

  useEffect(() => {
    const fetchModelDetails = async () => {
      if (selectedModel?.id) {
        try {
          const response = await axiosInstance.get(`/models/${selectedModel.id}`);
          setModelDetails(response.data);
          
          // Get allowed extensions from response header
          const extensionsHeader = response.headers['allowed-extensions'];
          if (extensionsHeader) {
            setAllowedExtensions(extensionsHeader.split(',').map(ext => ext.trim()));
          }
        } catch (error) {
          console.error('Error fetching model details:', error);
        }
      }
    };

    fetchModelDetails();
  }, [selectedModel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedModel || !optimizationName.trim()) {
      alert('Please ensure all required fields are filled.');
      return;
    }

    if (selectedModel.inputType !== 'STRING' && !file) {
      alert('Please select a file.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('name', optimizationName.trim());

      // Use different parameter names based on input type
      if (selectedModel.inputType === 'STRING') {
        formData.append('inputString', inputValue);
      } else {
        formData.append('inputFile', file as File);
      }

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log('FormData content:', pair[0], pair[1]);
      }

      const response = await axiosInstance.post(
        `/models/${selectedModel.id}/invoke`,
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

  const getAcceptedFileTypes = () => {
    switch (selectedModel?.inputType) {
      case 'IMAGE':
        return 'image/*';
      case 'FILE':
        return '.xlsx,.xls,.csv,.txt,application/json';
      default:
        return undefined;
    }
  };

  const validateFile = (file: File | null) => {
    if (!file || !selectedModel) return false;
    
    if (selectedModel.inputType === 'IMAGE' && !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return false;
    }
    
    return true;
  };

  const renderInput = () => {
    if (!selectedModel) return null;
  
    if (selectedModel.inputType === 'STRING') {
      return (
        <div>
          <Label htmlFor="input-value">Input Value</Label>
          <div className="mt-1">
            <Input
              id="input-value"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter input value"
              required
            />
          </div>
        </div>
      );
    }
    const hardcodedExtensions = ['.xlsx', '.xls', '.csv'];
  
    return (
      <div>
        <Label htmlFor="file">
          {selectedModel.inputType === 'IMAGE' ? 'Input Image' : 'Input File'}
        </Label>
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
              accept={getAcceptedFileTypes()}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] || null;
                if (selectedFile && validateFile(selectedFile)) {
                  setFile(selectedFile);
                }
              }}
            />
          </label>
          {selectedModel.inputType === 'FILE' && (
            <p className="mt-2 text-sm text-gray-500">
              Allowed file types: {hardcodedExtensions.join(', ')}
            </p>
          )}
          {selectedModel.inputType === 'IMAGE' && (
            <p className="mt-2 text-sm text-gray-500">
              Please select an image file (JPG, PNG, etc.)
            </p>
          )}
        </div>
      </div>
    );
  };
  

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">New Optimization</h2>
          <p className="text-gray-500 mb-4">
            {selectedModel?.inputType === 'STRING' 
              ? 'Enter your input value to invoke the selected optimization model.'
              : selectedModel?.inputType === 'IMAGE'
              ? 'Upload your image file to invoke the selected optimization model.'
              : 'Upload your file to invoke the selected optimization model.'}
          </p>
          <div className="space-y-4">
            <div>
              <Label>Model</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {selectedModel ? (
                  <p>
                    {selectedModel.name} - {selectedModel.inputType}
                  </p>
                ) : (
                  <p className="text-gray-500">No model selected</p>
                )}
              </div>
            </div>

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

            {renderInput()}
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={
              !selectedModel || 
              !optimizationName.trim() || 
              (selectedModel?.inputType !== 'STRING' && !file) ||
              (selectedModel?.inputType === 'STRING' && !inputValue.trim()) ||
              isSubmitting
            }
          >
            {isSubmitting ? 'Submitting...' : 'Send'}
          </Button>
        </div>
      </form>
    </Card>
  );
}