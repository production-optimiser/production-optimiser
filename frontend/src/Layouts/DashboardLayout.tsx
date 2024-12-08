import React, { useState } from 'react';
import SidebarNav from '../Components/sidebar';
import AppLayout from '../Components/navbar';

const DashboardLayout: React.FC = () => {
  const [selectedOptimization, setSelectedOptimization] = useState<string | null>(null);

  const handleOptimizationSelect = (id: string) => {
    setSelectedOptimization(id);
    // Add any additional logic for handling optimization selection
  };

  return (
    <AppLayout>
      <SidebarNav 
        onItemClick={handleOptimizationSelect}
        modelName="Python 1"
        modelVersion="v3.4.2"
      />
    </AppLayout>
  );
};

export default DashboardLayout;
