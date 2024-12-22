

// import React, { useEffect, useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/Components/ui/table';
// import { Input } from '@/Components/ui/input';
// import { Button } from '@/Components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/Components/ui/dialog';
// import { Checkbox } from '@/Components/ui/checkbox';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/Components/ui/dropdown-menu';
// import { MoreHorizontal } from 'lucide-react';
// import axiosInstance from '../../utils/axios'

// interface User {
//   id: string;
//   email: string;
//   status: string;
//   role: string;
//   optimizationModelIds: string[];
// }

// interface Model {
//   id: string;
//   name: string;
//   url: string;
//   createdAt: string;
//   status: string;
// }

// export const ModelAssignment = () => {
//   const [searchUser, setSearchUser] = useState('');
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [userModels, setUserModels] = useState<Model[]>([]);
//   const [filterModels, setFilterModels] = useState('');
//   const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
//   const [availableModels, setAvailableModels] = useState<Model[]>([]);
//   const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
//   const [modelToRemove, setModelToRemove] = useState<Model | null>(null);
//   const [dialogFilterModels, setDialogFilterModels] = useState('');

 
//   const searchUsers = async () => {
//     try {
//       console.log('Searching users...'); // Ensure this log works
//       const response = await axiosInstance.get<User[]>('/users');
//       console.log('Fetched users:', response.data); // Log the fetched users
  
//       const users = response.data;
//       const user = users.find((u) => u.email.toLowerCase() === searchUser.toLowerCase());
//       if (user) {
//         console.log('Found user:', user); // Log the found user
  
//         const userDetailsResponse = await axiosInstance.get<User>(`/users/${user.id}`);
//         console.log('Fetched user details:', userDetailsResponse.data); // Log user details
  
//         setSelectedUser(userDetailsResponse.data);
  
//         if (userDetailsResponse.data?.optimizationModelIds) {
//           const modelsResponse = await axiosInstance.get<Model[]>('/models');
//           console.log('Fetched all models:', modelsResponse.data); // Log all models
  
//           const userModels = modelsResponse.data.filter((model) =>
//             userDetailsResponse.data.optimizationModelIds.includes(model.id)
//           );
//           console.log('Filtered user models:', userModels); // Log filtered models
  
//           setUserModels(userModels);
//         } else {
//           console.log('No optimizationModelIds found for user');
//           setUserModels([]);
//         }
//       } else {
//         console.log('User not found');
//         setSelectedUser(null);
//         setUserModels([]);
//         alert('User not found');
//       }
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//       alert('Failed to fetch user details');
//     }
//   };
  

//   const [loadingModels, setLoadingModels] = useState(false);
  

//   const fetchAllModels = async () => {
//     try {
//       const modelsResponse = await axiosInstance.get('/models');
//       console.log('Available models for assignment:', modelsResponse.data);
//       setAvailableModels(modelsResponse.data);
//     } catch (error) {
//       console.error('Error fetching models:', error);
//       alert('Failed to fetch available models');
//       setAvailableModels([]);
//     }
//   };
  


//   const handleAssignModel = async (model: Model) => {
//     if (!selectedUser) return;
    
//     try {
//       await axiosInstance.post(`/users/${selectedUser.id}/models`, {
//         modelId: model.id
//       });
      
//       // Add the new model to the user's models list
//       setUserModels([...userModels, model]);
//       alert(`Model "${model.name}" has been assigned to ${selectedUser.email}`);
//       setIsAssignDialogOpen(false);
//     } catch (error) {
//       console.error('Error assigning model:', error);
//       alert('Failed to assign model to user');
//     }
//   };

//   const handleRemoveModel = async () => {
//     if (!modelToRemove || !selectedUser) return;
    
//     try {
//       await axiosInstance.delete(`/users/${selectedUser.id}/models/${modelToRemove.id}`);
//       setUserModels(userModels.filter(m => m.id !== modelToRemove.id));
//       alert(`Model "${modelToRemove.name}" has been removed from ${selectedUser.email}`);
//       setIsRemoveDialogOpen(false);
//       setModelToRemove(null);
//     } catch (error) {
//       console.error('Error removing model:', error);
//       alert('Failed to remove model from user');
//     }
//   };

//   const filteredModels = userModels.filter(model =>
//     model.name.toLowerCase().includes(filterModels.toLowerCase())
//   );

//   useEffect(() => {
//     if (isAssignDialogOpen) {
//       fetchAllModels();
//     }
//   }, [isAssignDialogOpen]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Model Assignment</h1>
      
//       <div className="flex gap-4 mb-6">
//         <Input
//           placeholder="Search User"
//           value={searchUser}
//           onChange={(e) => setSearchUser(e.target.value)}
//           className="max-w-sm"
//         />
//         <Button onClick={searchUsers}>Search</Button>
//       </div>

//       {selectedUser && (
//         <div className="bg-white rounded-lg shadow p-4 mb-6">
//           <h2 className="text-lg font-medium">{selectedUser.email}</h2>
//           <p className="text-sm text-gray-500">{selectedUser.id}</p>
//         </div>
//       )}

//       {selectedUser && (
//         <>
//           <Input
//             placeholder="Filter names..."
//             value={filterModels}
//             onChange={(e) => setFilterModels(e.target.value)}
//             className="max-w-sm mb-4"
//           />

//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-12"><Checkbox /></TableHead>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Url</TableHead>
//                 <TableHead>Id</TableHead>
//                 <TableHead>Created At</TableHead>
//                 <TableHead className="w-[70px]"></TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredModels.map((model) => (
//                 <TableRow key={model.id}>
//                   <TableCell><Checkbox /></TableCell>
//                   <TableCell>{model.name}</TableCell>
//                   <TableCell>{model.url}</TableCell>
//                   <TableCell>{model.id}</TableCell>
//                   <TableCell>{model.createdAt}</TableCell>
//                   <TableCell>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                           className="text-red-600"
//                           onClick={() => {
//                             setModelToRemove(model);
//                             setIsRemoveDialogOpen(true);
//                           }}
//                         >
//                           Remove Model
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           <div className="mt-4">
//             <Button
//               onClick={() => setIsAssignDialogOpen(true)}
//               className="bg-amber-600 hover:bg-amber-700"
//             >
//               Assign Model
//             </Button>
//           </div>
//         </>
//       )}
      

//       {/* Assign Model Dialog */}
//       <Dialog 
//   open={isAssignDialogOpen} 
//   onOpenChange={setIsAssignDialogOpen}
// >
//   <DialogContent className="max-w-xl">
//     <DialogHeader>
//       <DialogTitle>Assign Model to User</DialogTitle>
//     </DialogHeader>
//     <div className="space-y-4">
//       <Input 
//         placeholder="Search models..." 
//         onChange={(e) => setDialogFilterModels(e.target.value)}
//         value={dialogFilterModels}
//       />
//       <div className="max-h-96 overflow-y-auto">
//         {availableModels.length === 0 ? (
//           <div className="text-center py-4 text-gray-500">
//             Loading models...
//           </div>
//         ) : (
//           availableModels
//             .filter(model => 
//               model.name.toLowerCase().includes(dialogFilterModels.toLowerCase())
//             )
//             .map((model) => (
//               <div 
//                 key={model.id} 
//                 className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
//               >
//                 <div>
//                   <div className="font-medium">{model.name}</div>
//                   <div className="text-sm text-gray-500">{model.url}</div>
//                 </div>
//                 <Button
//                   onClick={() => handleAssignModel(model)}
//                   size="sm"
//                 >
//                   Select
//                 </Button>
//               </div>
//             ))
//         )}
//       </div>
//     </div>
//     <DialogFooter>
//       <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
//         Cancel
//       </Button>
//     </DialogFooter>
//   </DialogContent>
// </Dialog>

//       {/* Remove Model Confirmation Dialog */}
//       <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Remove Model</DialogTitle>
//           </DialogHeader>
//           <div className="py-4">
//             Are you sure you want to remove this model from the user?
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsRemoveDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleRemoveModel}
//             >
//               Remove
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ModelAssignment;

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
          // Keep track of deleted models to potentially show a message
          const deletedModelIds: string[] = [];
          
          const models = await Promise.all(
            userDetailsResponse.data.optimizationModelIds.map(async (modelId: string) => {
              try {
                const modelResponse = await axiosInstance.get(`/models/${modelId}`);
                return modelResponse.data;
              } catch (error: any) {
                if (error.response?.status === 404) {
                  deletedModelIds.push(modelId);
                }
                return null;
              }
            })
          );
  
          // Filter out any null responses (models that couldn't be fetched)
          const validModels = models.filter((model): model is Model => 
            model !== null && model !== undefined
          );
          setUserModels(validModels);
  
          // Optionally show a message if some models were deleted
          if (deletedModelIds.length > 0) {
            console.info(`${deletedModelIds.length} model(s) are no longer available`);
            // Optionally: You could clean up the user's model list here by making an API call
            // to remove the deleted model IDs from the user's optimizationModelIds
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

  const fetchAllModels = async () => {
    try {
      const modelsResponse = await axiosInstance.get('/models');
      console.log('Available models for assignment:', modelsResponse.data);
      setAvailableModels(modelsResponse.data);
    } catch (error) {
      console.error('Error fetching models:', error);
      alert('Failed to fetch available models');
      setAvailableModels([]);
    }
  };

  // const handleAssignModel = async (model: Model) => {
  //   if (!selectedUser) return;
    
  //   try {
  //     await axiosInstance.post(`/users/${selectedUser.id}/models`, {
  //       modelId: model.id
  //     });
      
  //     // Add the new model to the user's models list
  //     setUserModels([...userModels, model]);
  //     alert(`Model "${model.name}" has been assigned to ${selectedUser.email}`);
  //     setIsAssignDialogOpen(false);
  //   } catch (error) {
  //     console.error('Error assigning model:', error);
  //     alert('Failed to assign model to user');
  //   }
  // };

  const handleAssignModel = async (model: Model) => {
    if (!selectedUser) return;
  
    try {
      // Construct the array of model IDs
      const modelIds = [...selectedUser.optimizationModelIds, model.id];
  
      // Ensure the query string is formatted correctly
      const params = {
        optimizationModelIds: modelIds.join(','), // Convert array to comma-separated string
      };
  
      console.log('Sending PATCH request with params:', params);
  
      // Make the PATCH request
      await axiosInstance.patch(`/users/${selectedUser.id}`, null, { params });
  
      // Update local state on success
      setSelectedUser({
        ...selectedUser,
        optimizationModelIds: modelIds,
      });
      setUserModels([...userModels, model]);
  
      alert(`Model "${model.name}" has been assigned to ${selectedUser.email}`);
      setIsAssignDialogOpen(false);
    } catch (error) {
      // Log the error for debugging
      console.error('Error assigning model:', error.response?.data || error.message);
      alert('Failed to assign model to user');
    }
  };
  
  
  const handleRemoveModel = async () => {
    if (!modelToRemove || !selectedUser) return;
    
    try {
      await axiosInstance.delete(`/users/${selectedUser.id}/models/${modelToRemove.id}`);
      setUserModels(userModels.filter(m => m.id !== modelToRemove.id));
      alert(`Model "${modelToRemove.name}" has been removed from ${selectedUser.email}`);
      setIsRemoveDialogOpen(false);
      setModelToRemove(null);
    } catch (error) {
      console.error('Error removing model:', error);
      alert('Failed to remove model from user');
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
              onClick={() => setIsAssignDialogOpen(true)}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Assign Model
            </Button>
          </div>
        </>
      )}

      {/* Assign Model Dialog */}
      <Dialog 
        open={isAssignDialogOpen} 
        onOpenChange={setIsAssignDialogOpen}
      >
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
              {availableModels.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Loading models...
                </div>
              ) : (
                availableModels
                  .filter(model => 
                    model.name.toLowerCase().includes(dialogFilterModels.toLowerCase())
                  )
                  .map((model) => (
                    <div 
                      key={model.id} 
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                    >
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-gray-500">{model.url}</div>
                      </div>
                      <Button
                        onClick={() => handleAssignModel(model)}
                        size="sm"
                      >
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