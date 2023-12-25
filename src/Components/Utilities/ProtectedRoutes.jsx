import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../../Context/AuthContext';

const ProtectedRoutes = ({ children }) => {
  const { user } = UserAuth();
  console.log(user)
  if (!user) {
    return <Navigate to='/login' />;
  }

  return children;
};

export default ProtectedRoutes;
