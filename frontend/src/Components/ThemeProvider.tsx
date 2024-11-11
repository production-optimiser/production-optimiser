import React from 'react'
import { ThemeProvider as ThemeContextProvider } from '../Contexts/ThemeContext.tsx'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }): JSX.Element => {
  return <ThemeContextProvider>{children}</ThemeContextProvider>
}

export default ThemeProvider