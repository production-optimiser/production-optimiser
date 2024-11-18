import React from 'react';
import SidebarNav from '../components/sidebar';
import AppLayout from '../components/navbar';

const App: React.FC = () => {
  return (
    <AppLayout>
      <SidebarNav />
    </AppLayout>
  );
};

export default App;
