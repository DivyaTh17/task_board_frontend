import React from 'react';
import './App.css'; // Import CSS file for styling (optional)
import { Dashboard } from './screens/dashboard/dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route
        path='/'
        element={<Dashboard/>}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
