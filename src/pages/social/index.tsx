import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '~/Components/Header';
import '~/pages/social/Social.scss';

const Social = () => {
  
  return (
    <div>
      <Header />
      <div className="dashboard">
        <div className="dashboard-sidebar">sidebar</div>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Social;
