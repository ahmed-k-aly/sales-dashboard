import React from 'react';
import Dashboard from './Dashboard';
import './App.css';
import {createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  primaryColor: 'cyan',
});
const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl font-bold text-center my-4">Sales Dashboard</h1>
      </header>
      <main>
        <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <Dashboard />
        </MantineProvider>
      </main>
    </div>
  );
};

export default App;
