import React from 'react';
import { FaCaretDown, FaRegBell, FaRegEnvelope } from 'react-icons/fa';
import logo from '~/assets/images/logo.svg';
import '~/Components/Header/Header.scss';
import Avatar from '~/Components/Avatar';
const Header = () => {
  return (
    <div>
      <div className="header-nav-wrapper" data-testid="header-wrapper">
        <div className="header-navbar">
          <div className="header-image" data-testid="header-image">
            <img src={logo} className="img-fluid" alt="" />
            <div className="app-name">
              Chithi
              <span className="environment">DEV</span>
            </div>
          </div>
          <div className="header-menu-toggle">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          <ul className="header-nav">
            <li className="header-nav-item active-item">
              <span className="header-list-name">
                <FaRegBell className="header-list-icon" />
                <span className="bg-danger-dots dots" data-testid="notification-dots">
                  5
                </span>
              </span>
              <ul className="dropdown-ul">
                <li className="dropdown-li"></li>
              </ul>
              &nbsp;
            </li>
            <li className="header-nav-item active-item">
              <span className="header-list-name">
                <FaRegEnvelope className="header-list-icon" />
                <span className="bg-danger-dots dots" data-testid="messages-dots"></span>
              </span>
              &nbsp;
            </li>
            <li className="header-nav-item">
              <span className="header-list-name profile-image">
                <Avatar name='antar' size={30} textColor='#ffffff' avatarSrc=''  />
              </span>
              <span className="header-list-name profile-name">
                Danny
                <FaCaretDown className="header-list-icon caret" />
              </span>
              <ul className="dropdown-ul">
                <li className="dropdown-li"></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
