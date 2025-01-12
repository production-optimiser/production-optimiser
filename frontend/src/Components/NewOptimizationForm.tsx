import { useState, useEffect } from 'react';
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelDetails = async () => {
      if (selectedModel?.id) {
        try {
          const response = await axiosInstance.get(`/models/${selectedModel.id}`);
          setModelDetails(response.data);
          
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

  useEffect(() => {
    // Cleanup preview URL when component unmounts or file changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

      if (selectedModel.inputType === 'STRING') {
        formData.append('inputString', inputValue);
      } else {
        formData.append('inputFile', file as File);
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
      alert('Done!');
    } catch (error: any) {
      console.error('Error starting optimization:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 403) {
          alert('Access denied: You do not have permission to perform this action.');
        } else if (status === 500) {
          const errorMessage = typeof data === 'string' ? data : data?.message || data?.error || 'Internal Server Error';
          alert(`Server error: ${errorMessage}`);
        } else {
          const errorMessage = typeof data === 'string' ? data : data?.message || data?.error || 'An unknown error occurred.';
          alert(`Error: ${errorMessage}`);
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
        return '.xlsx,.xls,.csv';
      default:
        return undefined;
    }
  };

  const validateFile = (file: File | null) => {
    if (!file || !selectedModel) return false;
    
    if (selectedModel.inputType === 'IMAGE') {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, GIF, ETC.)');
        return false;
      }
    } else if (selectedModel.inputType === 'FILE') {
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls') && !fileName.endsWith('.csv')) {
        alert('Please select an Excel or CSV file');
        return false;
      }
    }
    
    return true;
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      if (selectedModel?.inputType === 'IMAGE') {
        const newPreviewUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(newPreviewUrl);
      }
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
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
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </label>
          {previewUrl && selectedModel.inputType === 'IMAGE' && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 rounded-md mx-auto"
              />
            </div>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Allowed file types: {
              selectedModel.inputType === 'IMAGE' 
                ? 'JPG, PNG, GIF'
                : 'XLSX, XLS, CSV'
            }
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">New Service Execution</h2>
          <p className="text-gray-500 mb-4">
            {selectedModel?.inputType === 'STRING' 
              ? 'Enter your input value to invoke the selected service tool.'
              : selectedModel?.inputType === 'IMAGE'
              ? 'Upload your image file to invoke the selected service tool.'
              : 'Upload your file to invoke the selected service service tool.'}
          </p>
          <div className="space-y-4">
            <div>
              <Label>Service Tool</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {selectedModel ? (
                  <p>
                    {selectedModel.name} - {selectedModel.inputType}
                  </p>
                ) : (
                  <p className="text-gray-500">No Service Tool Selected</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="optimization-name">Service Execution Name</Label>
              <div className="mt-1">
                <Input
                  id="optimization-name"
                  type="text"
                  value={optimizationName}
                  onChange={(e) => setOptimizationName(e.target.value)}
                  placeholder="Enter Service Execution Name"
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