import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Components/Signup/Signup';
import Signin from './Components/Signin/Signin';
import { StoreContext } from './context/StoreContext';
import Dashboard from './Components/Dashboard/Dashboard';

const App = () => {
  const { token } = useContext(StoreContext)
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />

      {/* Conditionally allow dashboard */}
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/signin" />}
      />


    </Routes>
  );
};

export default App;
