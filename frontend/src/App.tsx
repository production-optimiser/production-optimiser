import React from 'react'
import ThemeProvider from './components/ThemeProvider'
import LoginPage from './Pages/loginPage'

import './App.css'
import Layout from './app/Layout.tsx'

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Layout/>
      </div>
    </ThemeProvider>
  )
}

export default App