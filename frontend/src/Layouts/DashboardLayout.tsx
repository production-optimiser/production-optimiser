// import React, { useState } from 'react';
// import SidebarNav from '../Components/sidebar';
// import AppLayout from '../Components/navbar';

// const DashboardLayout: React.FC = () => {
//   const [selectedOptimization, setSelectedOptimization] = useState<string | null>(null);

//   const handleOptimizationSelect = (id: string) => {
//     setSelectedOptimization(id);
//     // Add any additional logic for handling optimization selection
//   };

//   return (
//     <AppLayout>
//       <SidebarNav 
//         onItemClick={handleOptimizationSelect}
//         modelName="Python 1"
//         modelVersion="v3.4.2"
//       />
//     </AppLayout>
//   );
// };

// export default DashboardLayout;

import { useEffect, useState } from 'react';
import SidebarNav from '../Components/sidebar';
import AppLayout from '../Components/navbar';
import { authService } from '@/services/auth';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
  const [selectedOptimization, setSelectedOptimization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const navigate = useNavigate();

  const fetchModels = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) return;
      
      const response = await axiosInstance.get(`/api/users/${user.id}/models`);
      const models = response.data;
      setAvailableModels(models);
      if (models.length > 0) {
        setSelectedModel(models[0]);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizationSelect = (id: string) => {
    setSelectedOptimization(id);
    navigate('/optimizationresult');
  };

  useEffect(() => {
    fetchModels();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <SidebarNav
        modelName="Python 1"
        modelVersion="v3.4.2"
        onItemClick={handleOptimizationSelect}
        availableModels={availableModels}
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
      />
      <AppLayout />
    </div>
  );
};

export default DashboardLayout;
