import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const lightTheme = {
  backgroundColor: '#ffffff',
  textColor: '#000000',
  buttonBackground: '#f0f0f0',
  buttonText: '#333333'
};

const darkTheme = {
  backgroundColor: '#121212',
  textColor: '#ffffff',
  buttonBackground: '#333333',
  buttonText: '#f0f0f0'
};

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };

  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
