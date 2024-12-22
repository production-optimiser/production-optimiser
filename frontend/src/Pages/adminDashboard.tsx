

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '@/utils/axios'; // <-- Ensure this path matches your project structure

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Checkbox } from '@/components/ui/checkbox';

// import SidebarNav from '../Components/sidebar';
// import { UserManagement } from '../Components/users/UserManagement';
// import { ModelAssignment } from '../Components/users/ModelAssignment';
// import { UserRequests } from '../Components/users/UserRequests';
// import { DashboardStats } from '../Components/statistics/DashboardStats';
// import NewOptimizationForm from '../Components/NewOptimizationForm';

// // ---------------------------------
// // Types
// // ---------------------------------

// interface SidebarModel {
//   id: string;
//   name: string;
//   version: string;
// }

// interface ManageModel {
//   id: string;
//   name: string;
//   url: string;
//   createdAt: string;
// }

// // ---------------------------------
// // Sidebar Sections
// // ---------------------------------

// const sections = [
//   {
//     id: 'user-management',
//     title: 'User management',
//     items: [
//       {
//         id: 'invitations',
//         title: 'Invitations',
//         component: 'user-requests',
//       },
//       {
//         id: 'current-users',
//         title: 'Current users',
//         component: 'manage-users',
//       },
//     ],
//   },
//   {
//     id: 'model-statistics',
//     title: 'Model statistics',
//     items: [
//       {
//         id: 'all-statistics',
//         title: 'All statistics',
//         component: 'all-statistics',
//       },
//       {
//         id: 'python-model-1',
//         title: 'Python model 1',
//         component: 'python-model-1-stats',
//       },
//       {
//         id: 'python-model-2',
//         title: 'Python model 2',
//         component: 'python-model-2-stats',
//       },
//     ],
//   },
//   {
//     id: 'user-statistics',
//     title: 'User statistics',
//     items: [
//       {
//         id: 'all-users-stats',
//         title: 'All users',
//         component: 'all-users-stats',
//       },
//       {
//         id: 'low-usage-users',
//         title: 'Low usage users',
//         component: 'low-usage-stats',
//       },
//       {
//         id: 'high-usage-users',
//         title: 'High usage users',
//         component: 'high-usage-stats',
//       },
//     ],
//   },
//   {
//     id: 'model-management',
//     title: 'Model management',
//     items: [
//       {
//         id: 'current-models',
//         title: 'Current models',
//         component: 'manage-models',
//       },
//       {
//         id: 'model-playground',
//         title: 'Model playground',
//         component: 'model-playground',
//       },
//     ],
//   },
// ];

// // ---------------------------------
// // ManageModels Component
// // ---------------------------------

// const ManageModels = ({
//   models,
//   onOpenDialog,
// }: {
//   models: ManageModel[];
//   onOpenDialog: () => void;
// }) => {
//   return (
//     <>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Manage Models</h1>
//       </div>

//       <Input className="max-w-sm mb-6" placeholder="Filter names..." />

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-12">
//                 <Checkbox />
//               </TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Url</TableHead>
//               <TableHead>Id</TableHead>
//               <TableHead>Created At</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {models.map((model) => (
//               <TableRow key={model.id}>
//                 <TableCell>
//                   <Checkbox />
//                 </TableCell>
//                 <TableCell>{model.name}</TableCell>
//                 <TableCell>{model.url}</TableCell>
//                 <TableCell>{model.id}</TableCell>
//                 <TableCell>{model.createdAt}</TableCell>
//                 <TableCell className="text-right">
//                   <Button variant="ghost" size="sm">
//                     •••
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="mt-4 flex justify-between">
//         <Button
//           onClick={onOpenDialog}
//           className="bg-amber-600 hover:bg-amber-700"
//         >
//           Link Model
//         </Button>
//         <div className="space-x-2">
//           <Button variant="outline">Previous</Button>
//           <Button variant="outline">Next</Button>
//         </div>
//       </div>
//     </>
//   );
// };

// // ---------------------------------
// // AdminDashboard Component
// // ---------------------------------

// const AdminDashboard = () => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [currentSection, setCurrentSection] = useState('all-statistics');

//   // Corrected bracket/TypeScript for the contentState:
//   const [contentState, setContentState] = useState<{ type: 'empty' | 'new-chat' }>({
//     type: 'empty',
//   });

//   const navigate = useNavigate();

//   // Models available for the "Model playground" or "New Optimization" form
//   const [availableModels] = useState<SidebarModel[]>([
//     {
//       id: '1',
//       name: 'Python 1',
//       version: 'v3.4.2',
//     },
//   ]);
//   const [selectedModel, setSelectedModel] = useState<SidebarModel | null>(
//     availableModels[0] || null
//   );

//   // We store the "Manage models" data here
//   const [manageModels] = useState<ManageModel[]>([
//     {
//       id: '851be781-5493-4ea4-95a5-62e87bd5c7f0',
//       name: 'Model 1',
//       url: 'model1-python-docker.com',
//       createdAt: '11/11/2024 10:54',
//     },
//     {
//       id: '852be781-5493-4ea4-95a5-62e87bd5c7f0',
//       name: 'Model 2',
//       url: 'model2-python-docker.com',
//       createdAt: '11/11/2024 10:54',
//     },
//     {
//       id: '853be781-5493-4ea4-95a5-62e87bd5c7f0',
//       name: 'Model 3',
//       url: 'model3-python-docker.com',
//       createdAt: '11/11/2024 10:54',
//     },
//   ]);

//   // State for the "Link Model" form
//   const [modelName, setModelName] = useState('');
//   const [modelUrl, setModelUrl] = useState('');

//   // Switch content to "new-chat"
//   const handleNewChat = () => {
//     setContentState({ type: 'new-chat' });
//   };

//   // Render main section based on currentSection
//   const renderContent = () => {
//     if (contentState.type === 'new-chat') {
//       return (
//         <NewOptimizationForm
//           selectedModel={selectedModel}
//           onSubmit={(formData) => console.log('Admin Submit:', formData)}
//         />
//       );
//     }

//     switch (currentSection) {
//       case 'manage-users':
//         return <UserManagement />;
//       case 'manage-models':
//         return (
//           <ManageModels
//             models={manageModels}
//             onOpenDialog={() => setIsDialogOpen(true)}
//           />
//         );
//       case 'model-assignment':
//         return <ModelAssignment />;
//       case 'user-requests':
//         return <UserRequests />;
//       case 'all-statistics':
//       case 'python-model-1-stats':
//       case 'python-model-2-stats':
//       case 'all-users-stats':
//       case 'low-usage-stats':
//       case 'high-usage-stats':
//         return <DashboardStats />;
//       default:
//         return <DashboardStats />;
//     }
//   };

//   // Called when user clicks "Link" in the dialog
//   const handleLinkModel = async () => {
//     try {
//       await axiosInstance.post('/models', {
//         name: modelName,
//         apiUrl: modelUrl,
//         userIds: [],
//       });

//       alert('Model linked successfully!');
//       setIsDialogOpen(false);

//       // Reset the form fields
//       setModelName('');
//       setModelUrl('');
//       // If you need to fetch updated list from the backend, do it here
//     } catch (error) {
//       console.error('Error linking model:', error);
//     }
//   };

//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div className="w-64">
//         <SidebarNav
//           modelName="Admin Panel"
//           modelVersion="v1.0"
//           sections={sections}
//           onItemClick={(id) => {
//             const item = sections
//               .flatMap((section) => section.items)
//               .find((item) => item.id === id);
//             if (item) {
//               setCurrentSection(item.component || id);
//             }
//           }}
//           onNewChat={handleNewChat}
//           availableModels={availableModels}
//           selectedModel={selectedModel}
//           onModelSelect={setSelectedModel}
//         />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">{renderContent()}</div>

//       {/* Link Model Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add Model</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Name</label>
//               <Input
//                 value={modelName}
//                 onChange={(e) => setModelName(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium">Url</label>
//               <Input
//                 value={modelUrl}
//                 onChange={(e) => setModelUrl(e.target.value)}
//               />
//             </div>
//             <Button
//               onClick={handleLinkModel}
//               className="w-full bg-amber-600 hover:bg-amber-700"
//             >
//               Link
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AdminDashboard;


// AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axios'; // <-- Make sure this path is correct for your project

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

import SidebarNav from '../Components/sidebar';
import { UserManagement } from '../Components/users/UserManagement';
import { ModelAssignment } from '../Components/users/ModelAssignment';
import { UserRequests } from '../Components/users/UserRequests';
import { DashboardStats } from '../Components/statistics/DashboardStats';
import NewOptimizationForm from '../Components/NewOptimizationForm';

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
  url: string;         // We'll map "apiUrl" from the backend to "url" here
  createdAt: string;
}

// ---------------------------------
// Sidebar Sections
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
      {
        id: 'python-model-1',
        title: 'Python model 1',
        component: 'python-model-1-stats',
      },
      {
        id: 'python-model-2',
        title: 'Python model 2',
        component: 'python-model-2-stats',
      },
    ],
  },
  {
    id: 'user-statistics',
    title: 'User statistics',
    items: [
      {
        id: 'all-users-stats',
        title: 'All users',
        component: 'all-users-stats',
      },
      {
        id: 'low-usage-users',
        title: 'Low usage users',
        component: 'low-usage-stats',
      },
      {
        id: 'high-usage-users',
        title: 'High usage users',
        component: 'high-usage-stats',
      },
    ],
  },
  {
    id: 'model-management',
    title: 'Model management',
    items: [
      {
        id: 'current-models',
        title: 'Current models',
        component: 'manage-models',
      },
      {
        id: 'model-playground',
        title: 'Model playground',
        component: 'model-playground',
      },
    ],
  },
];

// ---------------------------------
// ManageModels Component
// ---------------------------------

const ManageModels = ({
  models,
  onOpenDialog,
}: {
  models: ManageModel[];
  onOpenDialog: () => void;
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
      </div>

      <div className="mt-4 flex justify-between">
        <Button
          onClick={onOpenDialog}
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
// AdminDashboard Component
// ---------------------------------

const AdminDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('all-statistics');

  const [contentState, setContentState] = useState<{ type: 'empty' | 'new-chat' }>({
    type: 'empty',
  });

  const navigate = useNavigate();

  // Models available for the "Model playground" or "New Optimization" form
  const [availableModels] = useState<SidebarModel[]>([
    {
      id: '1',
      name: 'Python 1',
      version: 'v3.4.2',
    },
  ]);
  const [selectedModel, setSelectedModel] = useState<SidebarModel | null>(
    availableModels[0] || null
  );

  // The list of models from /models endpoint
  const [manageModels, setManageModels] = useState<ManageModel[]>([]);

  // State for the "Link Model" form
  const [modelName, setModelName] = useState('');
  const [modelUrl, setModelUrl] = useState('');

  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axiosInstance.get<ManageModel[]>('/models');
      // Depending on your backend field names, you might need to map:
      // e.g. if the backend returns { apiUrl: "...", ... }, map it to { url: responseItem.apiUrl }
      // but let's assume it already returns "url"
      setManageModels(response.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  // Switch content to "new-chat"
  const handleNewChat = () => {
    setContentState({ type: 'new-chat' });
  };

  // Render main section based on currentSection
  const renderContent = () => {
    if (contentState.type === 'new-chat') {
      return (
        <NewOptimizationForm
          selectedModel={selectedModel}
          onSubmit={(formData) => console.log('Admin Submit:', formData)}
        />
      );
    }

    switch (currentSection) {
      case 'manage-users':
        return <UserManagement />;
      case 'manage-models':
        return (
          <ManageModels
            models={manageModels}
            onOpenDialog={() => setIsDialogOpen(true)}
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
  };

  // Called when user clicks "Link" in the dialog
  const handleLinkModel = async () => {
    try {
      await axiosInstance.post('/models', {
        name: modelName,
        apiUrl: modelUrl,
        userIds: [],
      });

      alert('Model linked successfully!');
      setIsDialogOpen(false);

      // Reset the form fields
      setModelName('');
      setModelUrl('');

      // Refresh the list
      fetchModels();
    } catch (error) {
      console.error('Error linking model:', error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64">
        <SidebarNav
          modelName="Admin Panel"
          modelVersion="v1.0"
          sections={sections}
          onItemClick={(id) => {
            const item = sections
              .flatMap((section) => section.items)
              .find((item) => item.id === id);
            if (item) {
              setCurrentSection(item.component || id);
            }
          }}
          onNewChat={handleNewChat}
          availableModels={availableModels}
          selectedModel={selectedModel}
          onModelSelect={setSelectedModel}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{renderContent()}</div>

      {/* Link Model Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Model</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Url</label>
              <Input
                value={modelUrl}
                onChange={(e) => setModelUrl(e.target.value)}
              />
            </div>
            <Button
              onClick={handleLinkModel}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
