import React, { useState } from 'react';
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
import axiosInstance from '../../utils/axios'

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
  
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [modelToRemove, setModelToRemove] = useState<Model | null>(null);

  const searchUsers = async () => {
    try {
      // Fetch all users
      const response = await axiosInstance.get<User[]>('/users');
      const users = response.data;
  
      // Find user by email
      const user = users.find((u) => u.email.toLowerCase() === searchUser.toLowerCase());
      if (user) {
        // Fetch detailed user info
        const userDetailsResponse = await axiosInstance.get<User>(`/users/${user.id}`);
        setSelectedUser(userDetailsResponse.data);
        
        // Check if optimizationModelIds exists in the response
        if (userDetailsResponse.data?.optimizationModelIds) {
          // Map through the model IDs and fetch each model's details
          const models = await Promise.all(
            userDetailsResponse.data.optimizationModelIds.map(async (modelId: string) => {
              try {
                const modelResponse = await axiosInstance.get(`/models/${modelId}`);
                return modelResponse.data;
              } catch (error) {
                console.error(`Error fetching model ${modelId}:`, error);
                return null;
              }
            })
          );
  
          // Filter out any null values from failed requests
          const validModels = models.filter(model => model !== null);
          setUserModels(validModels);
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
  

  const handleAssignModel = (model: Model) => {
    alert(`Model "${model.name}" has been assigned to ${selectedUser?.email}`);
    setIsAssignDialogOpen(false);
  };

  const handleRemoveModel = () => {
    if (!modelToRemove) return;
    
    alert(`Model "${modelToRemove.name}" has been removed from ${selectedUser?.email}`);
    setUserModels(userModels.filter(m => m.id !== modelToRemove.id));
    setIsRemoveDialogOpen(false);
    setModelToRemove(null);
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
              onClick={() => setIsAssignDialogOpen(true)}
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
              {userModels.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                  <div>
                    <div>{model.name}</div>
                    <div className="text-sm text-gray-500">{model.url}</div>
                  </div>
                  <Button
                    onClick={() => handleAssignModel(model)}
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
