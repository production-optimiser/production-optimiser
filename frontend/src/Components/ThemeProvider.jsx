import React from 'react';
import { ThemeProvider as ThemeContextProvider } from '../Contexts/ThemeContext';
const ThemeProvider = ({ children }) => {
  return (
    <ThemeContextProvider>
      {children}
    </ThemeContextProvider>
  );
};

export default ThemeProvider;
