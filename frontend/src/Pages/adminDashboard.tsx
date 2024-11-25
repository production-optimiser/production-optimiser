import React, { useState } from 'react';
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
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Checkbox } from '@/Components/ui/checkbox';
import SidebarNav from '../Components/sidebar';
import { UserProfile } from '../Components/UserProfile';

interface Model {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

const AdminSidebarContent = () => {
  const sections = [
    {
      id: 'user-management',
      title: 'User management',
      items: [
        {
          id: 'manage-users',
          title: 'Manage Current Users',
        },
        {
          id: 'model-assignment',
          title: 'Model Assignment',
        },
        {
          id: 'account-requests',
          title: 'Account Requests',
        },
      ],
    },
    {
      id: 'model-management',
      title: 'Model management',
      items: [
        {
          id: 'manage-models',
          title: 'Manage Models',
        },
      ],
    },
  ];

  return (
    <div className="h-screen border-r flex flex-col">
      {/* Sidebar Navigation */}
      <div className="flex-grow">
        <SidebarNav modelName="Admin Panel" sections={sections} />
      </div>
      {/* User Profile at the bottom */}
      <div className="border-t mt-auto">
        <UserProfile name="Admin1" email="m@example.com" />
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [models] = useState<Model[]>([
    {
      id: '851be781-5493-4ea4-95a5-62e87bd5c7f0',
      name: 'Model 1',
      url: 'model1-python-docker.com',
      createdAt: '11/11/2024 10:54',
    },
    {
      id: '852be781-5493-4ea4-95a5-62e87bd5c7f0',
      name: 'Model 2',
      url: 'model2-python-docker.com',
      createdAt: '11/11/2024 10:54',
    },
    {
      id: '853be781-5493-4ea4-95a5-62e87bd5c7f0',
      name: 'Model 3',
      url: 'model3-python-docker.com',
      createdAt: '11/11/2024 10:54',
    },
  ]);

  return (
    <div className="flex">
      <div className="w-64">
        <AdminSidebarContent />
      </div>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Models</h1>
        </div>

        <Input className="max-w-sm mb-6" placeholder="Filter names..." />

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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{model.name}</TableCell>
                <TableCell>{model.url}</TableCell>
                <TableCell>{model.id}</TableCell>
                <TableCell>{model.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    •••
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex justify-between">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Link Model
          </Button>
          <div className="space-x-2">
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Model</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input />
              </div>
              <div>
                <label className="text-sm font-medium">Url</label>
                <Input />
              </div>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
