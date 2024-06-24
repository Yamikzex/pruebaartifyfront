import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Start from '../pages/start';
import RemoveBackground from '../pages/RemoveB';
import Changeformat from '../pages/ChangeF';
import CompressPage from './Compress';
import RemoveResult from '../pages/RemoveResu'; 
import Login from '../pages/Login'; 
import ChangeR from '../pages/ChangeR';
import CompressR from '../pages/CompressR';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<><Start /><Login /></>} />
            <Route path="/remove-background" element={<RemoveBackground />} />
            <Route path="/change-format" element={<Changeformat />} />
            <Route path="/compress" element={<CompressPage />} />
            <Route path="/remove-result" element={<RemoveResult />} />
            <Route path="/change-result" element={<ChangeR />} />
            <Route path="/compress-result" element={<CompressR />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
