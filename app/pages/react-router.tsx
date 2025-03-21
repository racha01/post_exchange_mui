import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './home';
// import About from '../components/About';

const ReactRouterPage: React.FC = () => {
  return (
    <div>
      <h1>React Router in Next.js</h1>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </div>
  );
};

export default ReactRouterPage;