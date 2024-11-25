import React from 'react';
import SidebarNav from '../Components/sidebar';
import AppLayout from '../Components/navbar';

const App: React.FC = () => {
  return (
    <AppLayout>
      <SidebarNav />
    </AppLayout>
  );
};

export default App;
