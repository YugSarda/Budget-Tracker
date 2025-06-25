
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Goals from "../pages/Goals";
// import Groups from "../pages/Groups";
import Predict from "../pages/Predict";




import Analysis from "../pages/Analysis";
import Refunds from "../pages/Refunds";


// Add this inside your <Routes>




// import {FinanceProvider} from "../contexts/FinanceContext.jsx";

import { Navigate } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
         <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/goals" element={<Goals />} />
       <Route path="/analysis" element={<Analysis />} />
        {/* <Route path="/groups" element={<Groups />} /> */}
        <Route path="/predict" element={<Predict />} />
        <Route path="/refunds" element={<Refunds />} />
       
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
         
      
    </Routes>
  );
};

export default AppRoutes;