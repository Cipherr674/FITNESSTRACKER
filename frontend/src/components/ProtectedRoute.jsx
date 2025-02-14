import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// Mock authentication function
const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  return !!sessionStorage.getItem('token');
};

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute; 