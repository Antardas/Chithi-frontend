import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '~/Components/Button';
import '~/pages/Error/Error.scss'
const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="error-container">
      <div className="oops">Oops!</div>
      <p className="not-found">Error 404: Page not found</p>
      <Button
        label="Back Home"
        className="back-button button"
        handleClick={() => {
          navigate(-1);
        }}
      />
    </div>
  );
};

export default Error;
