import React, { useState } from 'react'
import ThemeProvider from './Components/ThemeProvider'
import LoginPage from './Pages/loginPage'
import './App.css'
import Layout from './Layouts/DashboardLayout'
import ContactForm from './Pages/contactUs'

type ViewType = 'login' | 'contact' | 'dashboard';

function App(): JSX.Element {
  const [currentView, setCurrentView] = useState<ViewType>('login');

  const handleLogin = () => {
    setCurrentView('dashboard');
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
      
      case 'dashboard':
        return <Layout />;
      
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      {renderView()}
    </ThemeProvider>
  );
}

export default App
