import React, { useContext } from 'react';
import { ThemeContext } from '../Contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-sm rounded-lg transition duration-200 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      {theme === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
    </button>
  );
};

export default ThemeToggle;
