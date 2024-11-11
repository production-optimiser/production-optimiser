import React, { createContext, useState, useEffect, useContext } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

interface ThemeProviderProps {
  children: React.ReactNode
}

// Create the context with a default value
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }): JSX.Element => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    return savedTheme || 'light'
  })

  useEffect(() => {
    // Remove both classes first
    document.documentElement.classList.remove('light', 'dark')
    // Add the current theme class
    document.documentElement.classList.add(theme)
    // Store in localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  // Create the value object with proper typing
  const value: ThemeContextType = {
    theme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Add a custom hook for using the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}