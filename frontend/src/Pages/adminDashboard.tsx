import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UserProfile } from '../components/userProfile';

interface Model {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [models] = useState<Model[]>([
    {
      id: "851be781-5493-4ea4-95a5-62e87bd5c7f0",
      name: "Model 1",
      url: "model1-python-docker.com",
      createdAt: "11/11/2024 10:54"
    },
    // Add more models as needed
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Models</h1>
      </div>

      <Input 
        className="max-w-sm mb-6" 
        placeholder="Filter names..."
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
            <DialogTitle>Add user</DialogTitle>
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
            <Button 
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="fixed bottom-0 left-0 w-64 border-t">
        <UserProfile
          name="Admin1"
          email="m@example.com"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
