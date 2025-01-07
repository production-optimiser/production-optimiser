import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axios';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import SidebarNav from '../Components/sidebar';
import { UserManagement } from '../Components/users/UserManagement';
import { ModelAssignment } from '../Components/users/ModelAssignment';
import { UserRequests } from '../Components/users/UserRequests';
import { DashboardStats } from '../Components/statistics/DashboardStats';
import NewOptimizationForm from '../Components/NewOptimizationForm';
import LinkModelDialog from '@/Components/models/LinkModelDialog';
// ---------------------------------
// Types
// ---------------------------------

interface SidebarModel {
  id: string;
  name: string;
  version: string;
}

interface ManageModel {
  id: string;
  name: string;
  apiUrl: string;  
  inputType: string;
  createdAt: string;
}

interface EditModelForm {
  name: string;
  url: string;
  inputType: 'STRING' | 'FILE' | 'IMAGE';
}

// ---------------------------------
// Sidebar sections
// ---------------------------------

const sections = [
  {
    id: 'user-management',
    title: 'User management',
    items: [
      {
        id: 'invitations',
        title: 'Invitations',
        component: 'user-requests',
      },
      {
        id: 'current-users',
        title: 'Current users',
        component: 'manage-users',
      },
    ],
  },
  {
    id: 'model-statistics',
    title: 'Model statistics',
    items: [
      {
        id: 'all-statistics',
        title: 'All statistics',
        component: 'all-statistics',
      },
    ],
  },
  {
    id: 'model-management',
    title: 'Service Tool Management',
    items: [
      {
        id: 'current-models',
        title: 'Current Service Tools',
        component: 'manage-models',
      },
      {
        id: 'model-assignment',
        title: 'Service Tool Assignment',
        component: 'model-assignment'
      },
    ],
  },
];

// ---------------------------------
// ManageModels component
// ---------------------------------

const ManageModels = ({
  models,
  onLinkModelDialog,
  onEditModel,
  onRetireModel,
}: {
  models: ManageModel[];
  onLinkModelDialog: () => void;
  onEditModel: (model: ManageModel) => void;
  onRetireModel: (model: ManageModel) => void;
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Models</h1>
      </div>

      <Input className="max-w-sm mb-6" placeholder="Filter names..." />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Input Type</TableHead>
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
                <TableCell>{model.apiUrl}</TableCell>
                <TableCell>{model.inputType}</TableCell>
                <TableCell>{model.id}</TableCell>
                <TableCell>{model.createdAt}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditModel(model)}>
                        Edit Service Tool
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onRetireModel(model)}
                      >
                        Retire Service Tool
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-between">
        <Button
          onClick={onLinkModelDialog}
          className="bg-amber-600 hover:bg-amber-700"
        >
          Link Model
        </Button>
        <div className="space-x-2">
          <Button variant="outline">Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </>
  );
};

// ---------------------------------
// Main AdminDashboard component
// ---------------------------------

const AdminDashboard = () => {
  const [currentSection, setCurrentSection] = useState('all-statistics');
  const [contentState, setContentState] = useState<{
    type: 'empty' | 'new-chat' | 'section';
    section?: string;
  }>({
    type: 'empty'
  });

  const navigate = useNavigate();

  // Models available for the "Model playground" or "New Optimization" form
  const [availableModels,setAvailableModels] = useState<SidebarModel[]>([
    
  ]);
  const [selectedModelForPlayground, setSelectedModelForPlayground] = useState<SidebarModel | null>(
    availableModels[0] || null
  );

  // --------------------------------------------------------------------------------
  // Manage Models state
  // --------------------------------------------------------------------------------

  // The list we fetch from GET /models
  const [manageModels, setManageModels] = useState<ManageModel[]>([]);

  // Link Model (Add Model) dialog
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [modelName, setModelName] = useState('');
  const [modelUrl, setModelUrl] = useState('');

  // Edit Model dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditModelForm>({ name: '', url: '' });
  const [selectedModel, setSelectedModel] = useState<ManageModel | null>(null);

  // Retire Model dialog
  const [isRetireDialogOpen, setIsRetireDialogOpen] = useState(false);

  // --------------------------------------------------------------------------------
  // Lifecycle: Fetch models on mount
  // --------------------------------------------------------------------------------

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axiosInstance.get<ManageModel[]>('/models');
      setManageModels(response.data);
      setAvailableModels(response.data)
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  // --------------------------------------------------------------------------------
  // "Link model" actions
  // --------------------------------------------------------------------------------

  useEffect(() => {
    fetchModels();
  }, []);

  

  const handleLinkModel = async (formData: ModelPayload) => {
    try {
      const response = await axiosInstance.post('/models', formData);
      
      // Update the state immediately
      setManageModels(prevModels => [...prevModels, response.data]);
      setAvailableModels(prevModels => [...prevModels, response.data]);
      
      setIsLinkDialogOpen(false);
    } catch (error) {
      console.error('Full error details:', error.response?.data || error);
      throw error; // Throw the error so the dialog can handle it
    }
  };
 

  // --------------------------------------------------------------------------------
  // "Edit model" actions
  // --------------------------------------------------------------------------------

  /** Called from the 3-dot menu of a specific row */
  const handleOpenEditModel = (model: ManageModel) => {
    setSelectedModel(model);
    setEditForm({ 
      name: model.name, 
      url: model.apiUrl,
      inputType: model.inputType as 'STRING' | 'FILE' | 'IMAGE'
    });
    setIsEditDialogOpen(true);
  };

  /** When user clicks "Save" in the Edit Model dialog */
  const handlePatchModel = async () => {
    if (!selectedModel) return;
  
    try {
      await axiosInstance.patch(`/models/${selectedModel.id}`, {
        name: editForm.name,
        apiUrl: editForm.url,
        inputType: editForm.inputType,
        userIds: []
      });
  
      alert('Model updated successfully!');
      setIsEditDialogOpen(false);
  
      // Reset
      setSelectedModel(null);
      setEditForm({ name: '', url: '', inputType: 'STRING' }); // Add default inputType
  
      // Refresh
      fetchModels();
    } catch (error) {
      console.error('Error patching model:', error);
    }
  };

  // --------------------------------------------------------------------------------
  // "Retire model" actions
  // --------------------------------------------------------------------------------

  /** Called from the 3-dot menu of a specific row */
  const handleOpenRetireDialog = (model: ManageModel) => {
    setSelectedModel(model);
    setIsRetireDialogOpen(true);
  };

  /** When user confirms "Retire" in the Retire Model dialog */
  const handleRetireModel = async () => {
    if (!selectedModel) return;

    try {
      await axiosInstance.patch(`/models/${selectedModel.id}/retire`);
      alert('Model retired successfully!');
      setIsRetireDialogOpen(false);

      // Reset
      setSelectedModel(null);

      // Refresh
      await fetchModels();
    } catch (error) {
      console.error('Error retiring model:', error);
    }
  };

  // --------------------------------------------------------------------------------
  // "New Chat" action from the sidebar
  // --------------------------------------------------------------------------------

  const handleSectionClick = (id: string) => {
    const item = sections
      .flatMap((section) => section.items)
      .find((item) => item.id === id);
    if (item) {
      setContentState({ 
        type: 'section',
        section: item.component || id 
      });
    }
  };

  const handleNewChat = () => {
    setContentState({ type: 'new-chat' });
  };

  // --------------------------------------------------------------------------------
  // Render the main content
  // --------------------------------------------------------------------------------

  const renderContent = () => {
    if (contentState.type === 'new-chat') {
      return (
        <NewOptimizationForm
          selectedModel={selectedModelForPlayground}
          onSubmit={(formData) => console.log('Admin Submit:', formData)}
        />
      );
    }
  
    if (contentState.type === 'section') {
      switch (contentState.section) {
        case 'manage-users':
          return <UserManagement />;
        case 'manage-models':
          return (
            <ManageModels
              models={manageModels}
              onLinkModelDialog={() => setIsLinkDialogOpen(true)}
              onEditModel={handleOpenEditModel}
              onRetireModel={handleOpenRetireDialog}
            />
          );
        case 'model-assignment':
          return <ModelAssignment />;
        case 'user-requests':
          return <UserRequests />;
        case 'all-statistics':
        case 'python-model-1-stats':
        case 'python-model-2-stats':
        case 'all-users-stats':
        case 'low-usage-stats':
        case 'high-usage-stats':
          return <DashboardStats />;
        default:
          return <DashboardStats />;
      }
    }
  
    return <DashboardStats />; 
  };
  // --------------------------------------------------------------------------------
  // Return the overall layout
  // --------------------------------------------------------------------------------

  return (
    <div className="flex">
      <div className="w-64">
      <SidebarNav
  modelName="Admin Panel"
  modelVersion="v1.0"
  sections={sections}
  onItemClick={handleSectionClick}  
  onNewChat={handleNewChat}
  availableModels={availableModels}
  selectedModel={selectedModelForPlayground}
  onModelSelect={setSelectedModelForPlayground}
/>
      </div>

      <div className="flex-1 p-6">{renderContent()}</div>

      {/*
        Link Model Dialog
      */}
      <LinkModelDialog 
  isOpen={isLinkDialogOpen}
  onClose={() => setIsLinkDialogOpen(false)}
  onSubmit={handleLinkModel}
/>

      {/*
        Edit Model Dialog
      */}
      {/* Edit Model Dialog */}
<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Model</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <label>Name</label>
        <Input
          value={editForm.name}
          onChange={(e) =>
            setEditForm({ ...editForm, name: e.target.value })
          }
        />
      </div>
      <div className="grid gap-2">
        <label>URL</label>
        <Input
          value={editForm.url}
          onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label>Input Type</label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          value={editForm.inputType}
          onChange={(e) => 
            setEditForm({ 
              ...editForm, 
              inputType: e.target.value as 'STRING' | 'FILE' | 'IMAGE' 
            })
          }
        >
          <option value="STRING">STRING</option>
          <option value="FILE">FILE</option>
          <option value="IMAGE">IMAGE</option>
        </select>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
        Cancel
      </Button>
      <Button 
        onClick={handlePatchModel}
        disabled={
          !selectedModel ||
          (selectedModel.name === editForm.name && 
           selectedModel.apiUrl === editForm.url &&
           selectedModel.inputType === editForm.inputType)
        }
      >
        Save
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/*
        Retire Model Confirmation Dialog
      */}
      <Dialog open={isRetireDialogOpen} onOpenChange={setIsRetireDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Retire Model {selectedModel ? `"${selectedModel.name}"?` : '?'}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRetireDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRetireModel}>
              Retire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
