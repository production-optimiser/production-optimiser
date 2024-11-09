import React, { useState } from 'react'
import ThemeProvider from './components/ThemeProvider'
import LoginPage from './Pages/loginPage'

import './App.css'

import Layout from './Layouts/DashboardLayout.tsx'
import ContactForm from './Pages/contactUs.tsx'

function App(): JSX.Element {
  const [currentView, setCurrentView] = useState('login');

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {currentView === 'login' ? (
        <LoginPage onContactClick={() => setCurrentView('contact')} />
      ) : (
        <ContactForm onBackClick={() => setCurrentView('login')} />
      )}
    </div>
  );
}

export default App