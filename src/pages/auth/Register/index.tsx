import React from 'react';
import './Register.scss';
import Input from '../../../Components/Input';
import Button from '../../../Components/Button';

const Register = () => {
  return (
    <div className="auth-inner">
      <div className="alerts alert-error" role="alert">
        Error message
      </div>
      <form className="auth-form">
        <div className="form-input-container">
          {/* username field */}
          <Input id="Email" name="Email" type="email" value="Email" placeHolder="Enter Email" />
          <Input id="username" name="username" type="text" value="username" placeHolder="Username" />
          {/* password field */}
          <Input id="password" name="password" type="password" value="Password" placeHolder="Enter your password" />
        </div>
        {/* button component */}
        <Button
          label="Sign Up"
          className="auth-button button"
          disabled={false}
          handleClick={(e) => {
            e.preventDefault();
          }}
        />
      </form>
    </div>
  );
};

export default Register;
