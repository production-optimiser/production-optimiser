import React from 'react';
import ThemeProvider from './components/ThemeProvider';
import LoginPage from './Pages/loginPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App min-h-screen bg-white dark:bg-gray-900">
        <LoginPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
