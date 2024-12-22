import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  status?: 'ACTIVE' | 'DELETED';
  createdAt: string;
}

interface EditUserForm {
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  password?: string;
}

interface AddUserRequest {
  id: string;
  email: string;
  password: string;
  role: string;
  status: string;
  optimizationModelIds: string[];
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filterText, setFilterText] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // For adding users
  const [newUser, setNewUser] = useState({ email: '', password: '' });

  // For editing users
  const [editForm, setEditForm] = useState<EditUserForm>({
    email: '',
    role: 'CUSTOMER',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // If your Swagger doc uses /api/, do the same here:
      const response = await axiosInstance.get<User[]>('/users');
      setUsers(response.data);
      console.log('Fetched Users:', response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const generateRandomId = (): string => {
    return `id-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  };

  // Add user
  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password) {
      alert('Email and password are required.');
      return;
    }

    try {
      const request: AddUserRequest = {
        id: generateRandomId(),
        email: newUser.email,
        password: newUser.password,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        optimizationModelIds: [],
      };

      // POST /api/users
      await axiosInstance.post('/users', request);

      alert('User added successfully!');
      setIsAddDialogOpen(false);
      setNewUser({ email: '', password: '' });
      await fetchUsers();
    } catch (error: any) {
      console.error('Error adding user:', error?.response?.data || error.message);
    }
  };

  // Edit user
  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      // Build up query params based on the Swagger doc
      const params: Record<string, string> = {
        email: editForm.email,
        requestedRole: editForm.role,
      };
      // Only include password if the user actually typed something
      if (editForm.password) {
        params.password = editForm.password;
      }

      // PATCH /api/users/{id} with query parameters
      await axiosInstance.patch(`/users/${selectedUser.id}`, null, {
        params,
      });

      setIsEditDialogOpen(false);
      setSelectedUser(null);
      // Reset the form
      setEditForm({ email: '', role: 'CUSTOMER', password: '' });
      await fetchUsers();
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  // Block user
  const handleBlockUser = async () => {
    if (!selectedUser) return;
    try {
      // For blocking, just PATCH with status=DELETED (assuming that’s correct)
      await axiosInstance.patch(`/users/${selectedUser.id}`, null, {
        params: { status: 'DELETED' },
      });

      setIsBlockDialogOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      console.log('Attempting to delete user with id:', selectedUser.id);
      const response = await axiosInstance.delete(`/users/${selectedUser.id}`);
      console.log('API Response:', response);

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Open the Edit dialog
  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email,
      role: user.role,
      password: '',
    });
    setIsEditDialogOpen(true);
  };

  // Filter
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="flex justify-between mb-4">
        <Input
          placeholder="Filter emails..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddDialogOpen(true)}>Add User</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status || 'ACTIVE'}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenEditDialog(user)}>
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setIsBlockDialogOpen(true);
                        }}
                      >
                        Block User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add user</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={!newUser.email || !newUser.password}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Email</label>
              <Input
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label>Role</label>
              <Select
                value={editForm.role}
                onValueChange={(value: 'ADMIN' | 'CUSTOMER') =>
                  setEditForm({ ...editForm, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Single password field here */}
            <div className="grid gap-2">
              <label>Password</label>
              <Input
                type="password"
                placeholder="Enter new password (optional)"
                value={editForm.password || ''}
                onChange={(e) =>
                  setEditForm({ ...editForm, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditForm({ email: '', role: 'CUSTOMER', password: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block User Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block user ({selectedUser?.email})?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBlockUser}>
              Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;

