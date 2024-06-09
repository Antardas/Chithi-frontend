import React, { useEffect, useState } from 'react';
import './AuthTabs.scss';
import backgroundImage from '~/assets/images/background.jpg';
import { Login, Register } from '../index';
import { Utils } from '~/services/utils/utils.service';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '~/hooks/useLocalStorage';
import PageLoader from '~/Components/PageLoader';

const AuthTabs = (): React.JSX.Element => {
  const [type, setType] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  const [environment, setEnvironment] = useState<string>('');
  const [loggedIn, setLoggedIn, deleteLoggedIn] = useLocalStorage('keepLoggedIn');
  const loggedInBoolean = JSON.parse(loggedIn ?? '') as boolean;
  const navigate = useNavigate();
  useEffect(() => {
    setEnvironment(Utils.appEnvironment());
    if (loggedInBoolean) {
      if (loggedInBoolean) {
        console.log('whats this');

        navigate('/app/social/streams');
        // window.location.reload();
      }
    }
  }, [loggedIn, navigate]);
  return (
    <>
      {loggedInBoolean ? (
        <PageLoader />
      ) : (
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
                  <li className={`tab ${type === 'SIGN_IN' && 'active'}`} onClick={() => setType('SIGN_IN')}>
                    <button className="login">Sign In</button>
                  </li>
                  <li className={`tab ${type === 'SIGN_UP' && 'active'}`} onClick={() => setType('SIGN_UP')}>
                    <button className="signup">Sign Up</button>
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
      )}
    </>
  );
};

export default AuthTabs;
