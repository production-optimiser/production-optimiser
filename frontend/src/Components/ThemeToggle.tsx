import React from 'react'
import { useTheme } from '../Contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }): JSX.Element => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 text-sm rounded-lg transition duration-200 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${className ?? ''}`}
      type="button"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
    </button>
  )
}

export default ThemeToggle