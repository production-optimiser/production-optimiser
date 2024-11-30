// components/users/ModelAssignment.tsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
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

interface User {
  id: string;
  email: string;
}

interface Model {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export const ModelAssignment = () => {
  const [searchUser, setSearchUser] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userModels, setUserModels] = useState<Model[]>([]);
  const [filterModels, setFilterModels] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [modelToRemove, setModelToRemove] = useState<Model | null>(null);

  const searchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/users?filter=${searchUser}`);
      const user = response.data[0]; // Assuming we want the first match
      if (user) {
        setSelectedUser(user);
        fetchUserModels(user.id);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const fetchUserModels = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      setUserModels(response.data.models || []);
    } catch (error) {
      console.error('Error fetching user models:', error);
    }
  };

  const fetchAvailableModels = async () => {
    try {
      const response = await axiosInstance.get('/models');
      const allModels = response.data;
      // Filter out models that user already has
      const available = allModels.filter(
        (model: Model) => !userModels.some(um => um.id === model.id)
      );
      setAvailableModels(available);
    } catch (error) {
      console.error('Error fetching available models:', error);
    }
  };

  const handleAssignModels = async (selectedModels: Model[]) => {
    if (!selectedUser) return;
    try {
      // Keep old models and add new ones
      const updatedModels = [...userModels, ...selectedModels];
      await axiosInstance.patch(`/users/${selectedUser.id}`, {
        models: updatedModels
      });
      setIsAssignDialogOpen(false);
      fetchUserModels(selectedUser.id);
    } catch (error) {
      console.error('Error assigning models:', error);
    }
  };

  const handleRemoveModel = async () => {
    if (!selectedUser || !modelToRemove) return;
    try {
      const updatedModels = userModels.filter(m => m.id !== modelToRemove.id);
      await axiosInstance.patch(`/users/${selectedUser.id}`, {
        models: updatedModels
      });
      setIsRemoveDialogOpen(false);
      setModelToRemove(null);
      fetchUserModels(selectedUser.id);
    } catch (error) {
      console.error('Error removing model:', error);
    }
  };

  const filteredModels = userModels.filter(model =>
    model.name.toLowerCase().includes(filterModels.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Model Assignment</h1>
      
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search User"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={searchUsers}>Search</Button>
      </div>

      {selectedUser && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-medium">{selectedUser.email}</h2>
          <p className="text-sm text-gray-500">{selectedUser.id}</p>
        </div>
      )}

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
                <TableHead className="w-12"><Checkbox /></TableHead>
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
                  <TableCell><Checkbox /></TableCell>
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

          <div className="mt-4">
            <Button
              onClick={() => {
                fetchAvailableModels();
                setIsAssignDialogOpen(true);
              }}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Assign Model
            </Button>
          </div>
        </>
      )}

      {/* Assign Model Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Model to User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Type a command or search..." />
            <div className="max-h-96 overflow-y-auto">
              {availableModels.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                  <div>
                    <div>{model.name}</div>
                    <div className="text-sm text-gray-500">{model.url}</div>
                  </div>
                  <Button
                    onClick={() => handleAssignModels([model])}
                    size="sm"
                  >
                    Select
                  </Button>
                </div>
              ))}
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
            <Button
              variant="outline"
              onClick={() => setIsRemoveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveModel}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModelAssignment;
