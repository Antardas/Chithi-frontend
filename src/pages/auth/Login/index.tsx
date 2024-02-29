import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import './Login.scss';
import Input from '../../../Components/Input';
import Button from '../../../Components/Button';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="auth-inner">
      <div className="alerts alert-error" role="alert">
        Error message
      </div>
      <form className="auth-form">
        <div className="form-input-container">
          {/* username field */}
          <Input id="username" name="username" type="text" value="username" placeHolder="Username" />
          {/* password field */}
          <Input id="password" name="password" type="password" value="Password" placeHolder="Enter your password" />
          <label className="checkmark-container" htmlFor="checkbox">
            <Input id="checkbox" name="checkbox" type="checkbox" className="checkBox" checked={false} />
            Keep me signed in
          </label>
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
        <Link to={'/forget-password'}>
          <span className="forgot-password">
            Forgot password?
            <FaArrowRight className="arrow-right" />
          </span>
        </Link>
      </form>
    </div>
  );
};

export default Login;
