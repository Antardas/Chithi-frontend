import React, { useEffect, useState } from 'react';
import { ISideBarItems, fontAwesomeIcons, sideBarItems } from '~/services/utils/static.data';
import '~/Components/Sidebar/Sidebar.scss';
import { Location, createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';
const Sidebar = () => {
  const [sidebar, setSidebar] = useState<Array<ISideBarItems>>([]);
  const location: Location<unknown> = useLocation();
  const { profile } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const checkUrl = (name: string) => {
    return location.pathname.includes(name.toLowerCase());
  };

  const navigateToTop = (name: string, url: string): void => {
    if (name === 'Profile') {
      const newUrl = `${url}/${profile?.username}?${createSearchParams({
        id: `${profile?._id ?? ''}`,
        uId: `${profile?.uId ?? ''}`
      })}`;
console.log(newUrl);

      navigate(newUrl);
    } else {
      navigate(url);
    }
  };

  useEffect(() => {
    setSidebar(sideBarItems);
  }, []);
  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sidebar.map((item) => (
            <li key={item.index} onClick={() => navigateToTop(item.name, item.url)}>
              <div className={`sidebar-link ${checkUrl(item.name) ? 'active' : ''}`} data-testid="sidebar-list">
                <div className="menu-icon">{fontAwesomeIcons[item.iconName as keyof typeof fontAwesomeIcons]}</div>
                <div className="menu-link">
                  <span>{item.name}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
