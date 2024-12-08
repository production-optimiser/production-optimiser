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


import React, { useEffect, useState } from 'react';
import SidebarNav from '../Components/sidebar';
import AppLayout from '../Components/navbar';
import { authService } from '@/services/auth';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';


interface OptimizationItem {
  id: string;
  title: string;
  isDisabled?: boolean;
}
interface TimeSection {
  id: string;
  title: string;
  items: OptimizationItem[];
}

const DashboardLayout: React.FC = () => {
  const [selectedOptimization, setSelectedOptimization] = useState<string | null>(null);
  const [sections, setSections] = useState<TimeSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleOptimizationSelect = (id: string) => {
    setSelectedOptimization(id);
    navigate('/optimizationresult')
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const user = authService.getCurrentUser();

        if (user && !user.roles.includes('ADMIN')) {
          const response = await axiosInstance.get(
            `/results?userId=550e8400-e29b-41d4-a716-446655440002`
          );
          const resultItems = response.data.map(
            (result: { id: string; createdAt: string }) => ({
              id: result.id,
              title: `Result on ${new Date(result.createdAt).toLocaleDateString()}`,
            })
          );
          setSections([
            {
              id: 'optimization-results',
              title: 'Your Results',
              items: resultItems,
            },
          ]);
        } else {
          setSections([]); // Clear sections if user is admin
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optionally, you can use a spinner or skeleton loader
  }

  return (
    <AppLayout>
      <SidebarNav
        onItemClick={handleOptimizationSelect}
        modelName="Python 1"
        modelVersion="v3.4.2"
        sections={sections}
      />
    </AppLayout>
  );
};

export default DashboardLayout;
