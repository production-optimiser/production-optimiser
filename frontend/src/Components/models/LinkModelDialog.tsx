import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import axiosInstance, { handleApiError } from '../../utils/axios';
import { toast } from 'react-hot-toast';
 
// Type for the API payload
interface ModelPayload {
  name: string;
  apiUrl: string;
  inputType: string;
}

interface LinkModelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (model: ModelPayload) => void;
}

const INPUT_TYPE_MAPPING: Record<string, string> = {
  string: "STRING",
  image: "IMAGE",
  file: "FILE",
};


// const LinkModelDialog: React.FC<LinkModelDialogProps> = ({ 
//   isOpen, 
//   onClose, 
//   onSubmit 
// }) => {
//   const [modelName, setModelName] = useState('');
//   const [modelUrl, setModelUrl] = useState('');
//   const [inputType, setInputType] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const resetForm = () => {
//     setModelName('');
//     setModelUrl('');
//     setInputType('');
//   };

//   const handleDialogClose = () => {
//     if (!isLoading) {
//       resetForm();
//       onClose();
//     }
//   };

//   const handleSubmit = async () => {
//     if (!modelName || !modelUrl || !inputType) {
//       toast.error('Please fill in all fields');
//       return;
//     }
  
//     try {
//       setIsLoading(true);
  
//       // Check for duplicate names
//       const existingModels = await axiosInstance.get('/models');
//       const isDuplicate = existingModels.data.some(
//         (model: ModelPayload) => model.name === modelName.trim()
//       );
  
//       if (isDuplicate) {
//         toast.error('Model name already exists. Please choose a different name.');
//         return;
//       }
  
//       // Submit model
//       const payload = {
//         name: modelName.trim(),
//         apiUrl: modelUrl.startsWith('http') ? modelUrl.trim() : `https://${modelUrl.trim()}`,
//         inputType: INPUT_TYPE_MAPPING[inputType],
//       };
//       await axiosInstance.post('/models', payload);
//       toast.success('Model linked successfully!');
//       resetForm();
//       onClose();
//     } catch (error) {
//       console.error('Error:', error.response?.data || error);
//       toast.error('Failed to add model. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
const LinkModelDialog: React.FC<LinkModelDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [modelName, setModelName] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  const [inputType, setInputType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setModelName('');
    setModelUrl('');
    setInputType('');
  };

  const handleDialogClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!modelName || !modelUrl || !inputType) {
      toast.error('Please fill in all fields');
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Check for duplicate names
      const existingModels = await axiosInstance.get('/models');
      const isDuplicate = existingModels.data.some(
        (model: ModelPayload) => model.name === modelName.trim()
      );
  
      if (isDuplicate) {
        toast.error('Model name already exists. Please choose a different name.');
        return;
      }
  
      // Create payload
      const payload = {
        name: modelName.trim(),
        apiUrl: modelUrl.startsWith('http') ? modelUrl.trim() : `https://${modelUrl.trim()}`,
        inputType: INPUT_TYPE_MAPPING[inputType],
      };

      // Use the onSubmit prop instead of making the API call here
      await onSubmit(payload);
      
      toast.success('Model linked successfully!');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error:', error.response?.data || error);
      toast.error('Failed to add model. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Model</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="model-name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="model-name"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter model name"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="model-url" className="text-sm font-medium">
              URL
            </label>
            <Input
              id="model-url"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              placeholder="Enter model URL"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="input-type" className="text-sm font-medium">
              Input Type
            </label>
            <Select
              value={inputType}
              onValueChange={setInputType}
              disabled={isLoading}
            >
              <SelectTrigger id="input-type" className="w-full">
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
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            disabled={!modelName || !modelUrl || !inputType || isLoading}
          >
            {isLoading ? 'Linking...' : 'Link'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkModelDialog;