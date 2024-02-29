import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './ForgetPassword.scss';
import Input from '../../../Components/Input';
import Button from '../../../Components/Button';
import { Link } from 'react-router-dom';
import backgroundImage from '../../../assets/images/background.jpg';
const ForgetPassword = () => {
  return (
    <div
      className="container-wrapper"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover'
      }}
    >
      {' '}
      <div className="environment">DEV</div>
      <div className="container-wrapper-auth">
        <div className="tabs forgot-password-tabs">
          <div className="tabs-auth">
            <ul className="tab-group">
              <li className="tab">
                <div className="login forgot-password">Forgot Password</div>
              </li>
            </ul>

            <div className="tab-item">
              <div className="auth-inner">
                <form className="auth-form">
                  <div className="form-input-container">
                    {/* username field */}
                    <Input id="username" name="username" type="text" value="username" placeHolder="Enter your Email" />
                  </div>
                  {/* button component */}
                  <Button
                    label="Login"
                    className="auth-button button"
                    disabled={false}
                    handleClick={(e) => {
                      e.preventDefault();
                    }}
                  />
                  <Link to={'/'}>
                    <span className="forgot-password">
                      <FaArrowLeft className="arrow-right" />
                      Back to Login
                    </span>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
