import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

interface ReactRouterAppProviderProps {
  children: ReactNode;
}

const ReactRouterAppProvider: React.FC<ReactRouterAppProviderProps> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

export default ReactRouterAppProvider;