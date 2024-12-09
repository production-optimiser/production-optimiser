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

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import SidebarNav from '../Components/sidebar';
import NewOptimizationForm from '../Components/NewOptimizationForm';
import { authService } from '@/services/auth';
import axiosInstance from '../utils/axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

interface ContentState {
  type: 'new-chat' | 'optimization-result' | 'empty';
  resultId?: string;
}

interface Model {
  id: string;
  name: string;
  version: string;
}

const defaultSections = [
  {
    id: 'today-section',
    title: 'Today',
    items: [
      { id: 'candy-opt', title: 'Candy Optimization' },
      { id: 'plane-opt', title: 'Plane engine optimization' },
    ],
  },
  {
    id: 'last-7-days',
    title: 'Last 7 days',
    items: Array(10).fill(null).map((_, index) => ({
      id: `test-opt-${index}`,
      title: 'Test optimization',
    })),
  },
  {
    id: 'last-30-days',
    title: 'Last 30 days',
    items: Array(5).fill(null).map((_, index) => ({
      id: `old-opt-${index}`,
      title: 'Older optimization',
      isDisabled: true,
    })),
  },
];

export default function DashboardLayout() {
  const [selectedOptimization, setSelectedOptimization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [contentState, setContentState] = useState<ContentState>({ type: 'empty' });
  const [optimizationData, setOptimizationData] = useState(null);

  const fetchModels = async () => {
  try {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      console.error('No user ID found');
      return;
    }
    
    const response = await axiosInstance.get(`/users/${userId}`);
    
    if (response.data?.optimizationModelIds) {
      const models = response.data.optimizationModelIds.map(id => ({
        id,
        name: 'Python 1',
        version: 'v3.4.2'
      }));
      setAvailableModels(models);
      if (models.length > 0) {
        setSelectedModel(models[0]);
      }
    }
  } catch (error) {
    console.error('Error fetching user models:', error);
    setAvailableModels([]);
  }
  };
  const fetchOptimizationResults = async () => {

    try {
        const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      console.error('No user ID found');
      return;
    }

      const response = await axiosInstance.get(
        `/results?userId=550e8400-e29b-41d4-a716-446655440000`
      );
      if (response.data && response.data.length > 0) {
        setOptimizationData(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching optimization results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizationSelect = (id: string) => {
    setSelectedOptimization(id);
    setContentState({ type: 'optimization-result', resultId: id });
  };

  const handleNewChat = () => {
    setContentState({ type: 'new-chat' });
  };

  const handleNewOptimizationSubmit = async (formData: FormData) => {
    try {
      const response = await axiosInstance.post('/api/optimizations', formData);
      if (response.data.id) {
        setContentState({ type: 'optimization-result', resultId: response.data.id });
        fetchOptimizationResults();
      }
    } catch (error) {
      console.error('Error creating optimization:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchModels(), fetchOptimizationResults()]);
  }, []);

  const renderMachineUtilizationChart = () => {
    if (!optimizationData) return null;

    const data = [{
      name: optimizationData.averageInitialTotalMachineUtilization.toFixed(2),
      utilization: optimizationData.averageInitialTotalMachineUtilization
    }];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 60]} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="text-gray-600">{`Initial: ${optimizationData.averageInitialTotalMachineUtilization}`}</p>
                    <p className="text-purple-600">{`Machine Utilization: ${optimizationData.averageOptimizedTotalMachineUtilization}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="utilization" fill="#8884d8" name="Machine Utilization" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderProductionTimeChart = () => {
    if (!optimizationData) return null;

    const data = [{
      name: "816",
      time: optimizationData.initialTotalProductionTime
    }];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 600]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="time" stroke="#82ca9d" name="Production Time" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <SidebarNav
        sections={defaultSections}
        onItemClick={handleOptimizationSelect}
        onNewChat={handleNewChat}
        availableModels={availableModels}
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
      />
      <main className="flex-1 p-6 overflow-auto">
        {contentState.type === 'empty' && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-semibold mb-4">Select old chat or start a new one</h1>
          </div>
        )}
        {contentState.type === 'new-chat' && (
          <NewOptimizationForm
            selectedModel={selectedModel}
            onSubmit={handleNewOptimizationSubmit}
          />
        )}
        {contentState.type === 'optimization-result' && optimizationData && (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Optimization Results</h1>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Machine Utilization</h2>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                {renderMachineUtilizationChart()}
              </div>

              <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Production Time</h2>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                {renderProductionTimeChart()}
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Raw Data</h2>
              <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(optimizationData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

