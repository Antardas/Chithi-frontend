import React, { useState } from 'react';
import './AuthTabs.scss';
import backgroundImage from '~/assets/images/background.jpg';
import { Login, Register } from '../index';

const AuthTabs = (): React.JSX.Element => {
  const [type, setType] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  return (
    <>
      <div
        className="container-wrapper"
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      >
        <div className="environment">DEV</div>
        <div className="container-wrapper-auth">
          <div className="tabs">
            <div className="tabs-auth">
              <ul className="tab-group">
                <li className={`tab ${type === 'SIGN_IN' && 'active'}`}>
                  <button className="login" onClick={() => setType('SIGN_IN')}>
                    Sign In
                  </button>
                </li>
                <li className={`tab ${type === 'SIGN_UP' && 'active'}`}>
                  <button className="signup" onClick={() => setType('SIGN_UP')}>
                    Sign Up
                  </button>
                </li>
              </ul>
              {type === 'SIGN_IN' ? (
                <div className="tab-item">
                  <Login />
                </div>
              ) : (
                <div className="tab-item">
                  <Register />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthTabs;
