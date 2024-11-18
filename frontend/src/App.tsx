import React, { useState } from 'react';
import ThemeProvider from './components/ThemeProvider';
import LoginPage from './Pages/loginPage';
import './App.css';
import Layout from './Layouts/DashboardLayout';
import ContactForm from './Pages/contactUs';
import AdminDashboard from './Pages/adminDashboard';
import { AuthProvider, useAuth } from './contexts/authContext';

type ViewType = 'login' | 'contact' | 'dashboard' | 'admin';

function AppContent(): JSX.Element {
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const { login, hasRole } = useAuth();

  const handleLogin = (userData) => {
    login(userData);
    setCurrentView(userData.roles.includes('ADMIN') ? 'admin' : 'dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <LoginPage
              onContactClick={() => setCurrentView('contact')}
              onLogin={handleLogin}
            />
          </div>
        );

      case 'contact':
        return (
          <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <ContactForm
              onBackClick={() => setCurrentView('login')}
            />
          </div>
        );

      case 'admin':
        return <AdminDashboard />;

      case 'dashboard':
        return <Layout />;

      default:
        return null;
    }
  };

  return renderView();
}

function App(): JSX.Element {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
