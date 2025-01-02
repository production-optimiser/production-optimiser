
import { useEffect, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Download } from 'lucide-react';
import SidebarNav from '../Components/sidebar';
import NewOptimizationForm from '../Components/NewOptimizationForm';
import { authService } from '@/services/auth';
import axiosInstance from '../utils/axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { User } from '@/types/auth';

interface ContentState {
  type: 'new-chat' | 'optimization-result' | 'empty';
  resultId?: string;
}

interface Model {
  id: string;
  name: string;
  version: string;
  inputType: 'STRING' | 'FILE' | 'IMAGE';
}

// Updated to match the API response structure
interface OptimizationResultDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  inputFile: string;
  outputJSON: {
    average_initial_total_machine_utilization: number;
    average_optimized_total_machine_utilization: number;
    best_sequence_of_products: string;
    graphs: {
      machine_utilization: string;
      occupancy_graph: string;
      product_flow: string;
    };
    initial_total_production_time: number;
    optimized_total_production_time: number;
    maximum_pallets_used: {
      [key: string]: number;
    };
    pallets_defined_in_Excel: {
      [key: string]: number;
    };
    percentage_improvement: number;
    time_improvement: number;
    total_time_with_excel_pallets: number;
    total_time_with_optimized_pallets: number;
    utilization_improvement: number;
  };
}

interface OptimizationItem {
  id: string;
  title: string;
  isDisabled?: boolean;
  resultData?: OptimizationResultDto;
}

interface TimeSection {
  id: string;
  title: string;
  items: OptimizationItem[];
}

export default function DashboardLayout() {
  const [selectedOptimization, setSelectedOptimization] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [contentState, setContentState] = useState<ContentState>({ type: 'empty' });
  const [optimizationData, setOptimizationData] = useState<OptimizationResultDto | null>(null);
  const [dynamicSections, setDynamicSections] = useState<TimeSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // const fetchModels = async () => {
  //   try {
  //     const userId = localStorage.getItem('userId');
  //     if (!userId) {
  //       console.error('No user ID found');
  //       return;
  //     }
      
  //     const response = await axiosInstance.get(`/users/${userId}`);
      
  //     if (response.data?.optimizationModelIds) {
  //       const models = response.data.optimizationModelIds.map((id: string) => ({
  //         id,
  //         name: 'Python 1',
  //         version: 'v3.4.2',
  //         inputType: 
  //       }));
  //       setAvailableModels(models);
  //       if (models.length > 0) {
  //         setSelectedModel(models[0]);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user models:', error);
  //     setAvailableModels([]);
  //   }
  // };
  const fetchModels = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found');
        return;
      }
      
      const userResponse = await axiosInstance.get(`/users/${userId}`);
      
      if (userResponse.data?.optimizationModelIds) {
        // Fetch details for each model in parallel
        const modelDetailsPromises = userResponse.data.optimizationModelIds.map(async (id: string) => {
          try {
            const modelResponse = await axiosInstance.get(`/models/${id}`);
            return {
              id,
              name: modelResponse.data.name,
              version: 'v3.4.2', // You might want to get this from the API as well
              inputType: modelResponse.data.inputType
            };
          } catch (error) {
            console.error(`Error fetching model ${id}:`, error);
            return null;
          }
        });
  
        const modelResults = await Promise.all(modelDetailsPromises);
        const models = modelResults.filter((model): model is Model => model !== null);
        
  
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

  const fetchOptimizationResultById = async (id: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/results/${id}`);
      console.log('Fetched optimization result:', response.data);
      setOptimizationData(response.data);
    } catch (error) {
      console.error('Error fetching optimization result:', error);
      setOptimizationData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizationSelect = (id: string) => {
    setSelectedOptimization(id);
    setContentState({ type: 'optimization-result', resultId: id });
    fetchOptimizationResultById(id);
  };

  const handleNewChat = () => {
    setContentState({ type: 'new-chat' });
  };

  const handleNewOptimizationSubmit = async (response: any) => {
    try {
      console.log('Received optimization response:', response);
      if (response.id) {
        setContentState({ type: 'optimization-result', resultId: response.id });
        fetchOptimizationResultById(response.id);
      }
    } catch (error) {
      console.error('Error handling optimization response:', error);
    }
  };

  useEffect(() => {
    Promise.all([fetchModels()]);
  }, []);

  const generateOptimizationTitle = (result: OptimizationResultDto): string => {
    const improvementPercentage = result.outputJSON?.percentage_improvement 
      ? result.outputJSON.percentage_improvement.toFixed(2) 
      : 'N/A'; 
    const date = new Date(result.createdAt).toLocaleDateString();
    return `Optimization (${improvementPercentage}% improvement) - ${date}`;
  };

  const groupResultsByDate = (results: OptimizationResultDto[]): TimeSection[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);

    const sections: TimeSection[] = [
      { id: 'today', title: 'Today', items: [] },
      { id: 'yesterday', title: 'Yesterday', items: [] },
      { id: 'last-7-days', title: 'Last 7 days', items: [] },
      { id: 'last-30-days', title: 'Last 30 days', items: [] }
    ];

    results.forEach(result => {
      const resultDate = new Date(result.createdAt);
      const optimizationItem: OptimizationItem = {
        id: result.id,
        title: generateOptimizationTitle(result),
        isDisabled: false,
        resultData: result
      };

      if (resultDate >= today) {
        sections[0].items.push(optimizationItem);
      } else if (resultDate >= yesterday) {
        sections[1].items.push(optimizationItem);
      } else if (resultDate >= lastWeek) {
        sections[2].items.push(optimizationItem);
      } else if (resultDate >= lastMonth) {
        sections[3].items.push(optimizationItem);
      }
    });

    sections.forEach(section => {
      section.items.sort((a, b) => {
        const dateA = new Date((a.resultData as OptimizationResultDto).createdAt);
        const dateB = new Date((b.resultData as OptimizationResultDto).createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    });

    return sections.filter(section => section.items.length > 0);
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log('Current userId:', userId);
        const response = await axiosInstance.get('/results', {
          params: { userId: userId }
        });
        console.log('Sections API Response:', response.data);
        const results: OptimizationResultDto[] = response.data;
        const formattedSections = groupResultsByDate(results);
        setDynamicSections(formattedSections);
      } catch (error) {
        console.error('Error fetching sections:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchSections();
  }, [currentUser]);

  const renderMachineUtilizationChart = () => {
    if (!optimizationData?.outputJSON) {
      console.log('No optimization data available');
      return null;
    }
  
    const data = [
      {
        name: 'Initial',
        utilization: optimizationData.outputJSON.average_initial_total_machine_utilization
      },
      {
        name: 'Optimized',
        utilization: optimizationData.outputJSON.average_optimized_total_machine_utilization
      }
    ];
  
    console.log('Machine Utilization Chart Data:', data);
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
          <Legend />
          <Bar dataKey="utilization" fill="#8884d8" name="Machine Utilization (%)" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderProductionTimeChart = () => {
    if (!optimizationData?.outputJSON) {
      console.log('No optimization data available');
      return null;
    }
  
    const data = [
      {
        name: 'Initial',
        productionTime: optimizationData.outputJSON.initial_total_production_time
      },
      {
        name: 'Optimized',
        productionTime: optimizationData.outputJSON.optimized_total_production_time
      }
    ];
  
    console.log('Production Time Chart Data:', data);
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `${value.toFixed(2)} minutes`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="productionTime"
            stroke="#82ca9d"
            name="Production Time (minutes)"
            dot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  if (loading && contentState.type === 'optimization-result') {
    return <div className="flex items-center justify-center h-screen">Loading optimization results...</div>;
  }

  return (
    <div className="flex h-screen">
      <SidebarNav
        sections={dynamicSections}
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
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Optimization Results</h1>
              <div className="text-sm text-gray-500">
                Created: {new Date(optimizationData.createdAt).toLocaleString()}
              </div>
            </div>
            
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
                <div className="mt-4 text-sm text-gray-600">
                  Improvement: {optimizationData.outputJSON?.utilization_improvement.toFixed(2)}%
                </div>
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
                <div className="mt-4 text-sm text-gray-600">
                  Time saved: {optimizationData.outputJSON?.time_improvement.toFixed(2)} minutes
                </div>
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