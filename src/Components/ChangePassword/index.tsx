import React, { useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { Utils } from '~/services/utils/utils.service';
import useLocalStorage from '~/hooks/useLocalStorage';
import useSessionStorage from '~/hooks/useSessionStorage';
import { useAppDispatch } from '~/redux/store';
import { useNavigate } from 'react-router-dom';
import { userService } from '~/services/api/user/user.service';
import '~/Components/ChangePassword/ChangePassword.scss'
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [type, setType] = useState<string>('password');
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [, , removeStorageUsername] = useLocalStorage('username');
  const [, setLoggedIn] = useLocalStorage('keepLoggedIn');
  const [, , removeSessionPageReload] = useSessionStorage('pageReload');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const togglePasswordDisplay = () => {
    setTogglePassword(!togglePassword);
    const inputType = type === 'password' ? 'text' : 'password';
    setType(inputType);
  };

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await userService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (response) {
        Utils.dispatchNotification(response.data.message, 'success', dispatch);
        setTimeout(async () => {
          Utils.clearStore({
            dispatch,
            removeStorageUsername,
            removeSessionPageReload,
            setLoggedIn
          });
          await userService.logoutUser();
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      Utils.addErrorNotification(error, dispatch);
    }
  };
  return (
    <div className="password-change-container" data-testid="change-password">
      <form onSubmit={changePassword}>
        <div className="form-group">
          <Input
            id="currentPassword"
            name="currentPassword"
            type={type}
            value={currentPassword}
            labelText="Current Password"
            placeholder=""
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>
        <div className="form-group">
          <Input
            id="newPassword"
            name="newPassword"
            type={type}
            value={newPassword}
            labelText="New Password"
            placeholder=""
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </div>
        <div className="form-group">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={type}
            value={confirmPassword}
            labelText="Confirm Password"
            placeholder=""
            handleChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>

        <div className="form-group form-btn-group">
          <div className="btn-group">
            <Button label="Update" className="update" disabled={!currentPassword || !newPassword || !confirmPassword} />
            <span className="eye-icon" data-testid="eye-icon" onClick={togglePasswordDisplay}>
              {!togglePassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
