import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/Components/ui/dialog';
import { Checkbox } from '@/Components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import axiosInstance from '../../utils/axios';

interface User {
  id: string;
  email: string;
  status: string;
  role: string;
  optimizationModelIds: string[];
}

interface Model {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  optimizationModelIds: string[];
}

export const ModelAssignment = () => {
  const [searchUser, setSearchUser] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userModels, setUserModels] = useState<Model[]>([]);
  const [filterModels, setFilterModels] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [dialogFilterModels, setDialogFilterModels] = useState('');
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [modelToRemove, setModelToRemove] = useState<Model | null>(null);

  // Effect to fetch models when assign dialog opens
  useEffect(() => {
    if (isAssignDialogOpen) {
      fetchAllModels();
    }
  }, [isAssignDialogOpen]);

  // Fetch user by email
  const searchUsers = async () => {
    try {
      const response = await axiosInstance.get<User[]>('/users');
      const users = response.data;

      // Find by case-insensitive match on email
      const user = users.find(
        (u) => u.email.toLowerCase() === searchUser.toLowerCase()
      );

      if (user) {
        const userDetailsResponse = await axiosInstance.get<User>(
          `/users/${user.id}`
        );
        setSelectedUser(userDetailsResponse.data);

        // If user has assigned models, fetch them; filter out those that no longer exist
        if (userDetailsResponse.data?.optimizationModelIds) {
          const deletedModelIds: string[] = [];

          const models = await Promise.all(
            userDetailsResponse.data.optimizationModelIds.map(
              async (modelId: string) => {
                try {
                  const modelResponse = await axiosInstance.get(`/models/${modelId}`);
                  return modelResponse.data;
                } catch (error: any) {
                  if (error.response?.status === 404) {
                    deletedModelIds.push(modelId);
                  }
                  return null;
                }
              }
            )
          );

          const validModels = models.filter(
            (model): model is Model => model !== null && model !== undefined
          );
          setUserModels(validModels);

          if (deletedModelIds.length > 0) {
            console.info(
              `${deletedModelIds.length} model(s) are no longer available`
            );
          }
        } else {
          setUserModels([]);
        }
      } else {
        setSelectedUser(null);
        setUserModels([]);
        alert('User not found');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to fetch user details');
      setSelectedUser(null);
      setUserModels([]);
    }
  };

  // Fetch all models for assignment
  const fetchAllModels = async () => {
    try {
      const modelsResponse = await axiosInstance.get('/models');
      setAvailableModels(modelsResponse.data);
    } catch (error) {
      console.error('Error fetching models:', error);
      alert('Failed to fetch available models');
      setAvailableModels([]);
    }
  };

  // Filter out models user already has — except if the user is an admin
  const getModelsForAssignment = (): Model[] => {
    if (!selectedUser) return [];

    // If user is admin, show all
    if (selectedUser.role === 'ADMIN') {
      return availableModels;
    }

    // Otherwise, exclude models the user already has
    return availableModels.filter(
      (model) => !selectedUser.optimizationModelIds.includes(model.id)
    );
  };

  const handleAssignModel = async (model: Model) => {
    if (!selectedUser) return;

    try {
      const modelIds = [...selectedUser.optimizationModelIds, model.id];

      // We'll send them comma-separated as per your patch logic
      const params = {
        optimizationModelIds: modelIds.join(','),
      };

      await axiosInstance.patch(`/users/${selectedUser.id}`, null, { params });

      setSelectedUser({
        ...selectedUser,
        optimizationModelIds: modelIds,
      });
      setUserModels([...userModels, model]);

      alert(`Model "${model.name}" has been assigned to ${selectedUser.email}`);
      setIsAssignDialogOpen(false);
    } catch (error) {
      console.error(
        'Error assigning model:',
        (error as any).response?.data || (error as any).message
      );
      alert('Failed to assign model to user');
    }
  };

  // Remove model from user
  const handleRemoveModel = async () => {
    if (!modelToRemove || !selectedUser) return;
  
    try {
      const updatedModelList = userModels
        .filter((m) => m.id !== modelToRemove.id);
  
      const updatedModelIds = updatedModelList.map((m) => m.id);
  
      const params = {
        optimizationModelIds: updatedModelIds.join(','),
      };
      await axiosInstance.patch(`/users/${selectedUser.id}`, null, { params });
  
      setSelectedUser({
        ...selectedUser,
        optimizationModelIds: updatedModelIds,
      });
      setUserModels(updatedModelList);
  
      alert(`Model "${modelToRemove.name}" has been removed from ${selectedUser.email}`);
      
      setIsRemoveDialogOpen(false);
      setModelToRemove(null);
  
    } catch (error) {
      console.error('Error removing model:', error);
      alert('Failed to remove model from user');
    }
  };
  
  const filteredModels = userModels.filter((model) =>
    model.name.toLowerCase().includes(filterModels.toLowerCase())
  );

  // Models shown in the dialog (already filtered for admin vs non-admin)
  const dialogModels = getModelsForAssignment().filter((model) =>
    model.name.toLowerCase().includes(dialogFilterModels.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Model Assignment</h1>

      {/* Search user by email */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search User"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={searchUsers}>Search</Button>
      </div>

      {/* Display selected user info */}
      {selectedUser && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-medium">{selectedUser.email}</h2>
          <p className="text-sm text-gray-500">{selectedUser.id}</p>
          <p className="text-sm text-gray-500">Role: {selectedUser.role}</p>
        </div>
      )}

      {/* Models assigned to the user */}
      {selectedUser && (
        <>
          <Input
            placeholder="Filter names..."
            value={filterModels}
            onChange={(e) => setFilterModels(e.target.value)}
            className="max-w-sm mb-4"
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Url</TableHead>
                <TableHead>Id</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{model.name}</TableCell>
                  <TableCell>{model.url}</TableCell>
                  <TableCell>{model.id}</TableCell>
                  <TableCell>{model.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setModelToRemove(model);
                            setIsRemoveDialogOpen(true);
                          }}
                        >
                          Remove Model
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Hide the "Assign Model" button if user is Admin */}
          {selectedUser.role !== 'ADMIN' && (
            <div className="mt-4">
              <Button
                onClick={() => setIsAssignDialogOpen(true)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Assign Model
              </Button>
            </div>
          )}
        </>
      )}

      {/* Assign Model Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Assign Model to User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search models..."
              onChange={(e) => setDialogFilterModels(e.target.value)}
              value={dialogFilterModels}
            />
            <div className="max-h-96 overflow-y-auto">
              {dialogModels.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  {availableModels.length === 0
                    ? 'Loading models...'
                    : 'No models found.'}
                </div>
              ) : (
                dialogModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                  >
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-gray-500">{model.url}</div>
                    </div>
                    <Button onClick={() => handleAssignModel(model)} size="sm">
                      Select
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Model Confirmation Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Model</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to remove this model from the user?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveModel}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModelAssignment;
