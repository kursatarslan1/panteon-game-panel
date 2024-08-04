import React from 'react';
import ProfileDropdown from 'components/navbar/top/ProfileDropdown';
import { Nav } from 'react-bootstrap';
import ThemeControlDropdown from './ThemeControlDropdown';
import secureLocalStorage from "react-secure-storage";

const TopNavRightSideNavItem = () => {
  const user_first_name = secureLocalStorage.getItem('user_first_name');
  const user_last_name = secureLocalStorage.getItem('user_last_name');
  return (
    <Nav
      navbar
      className="navbar-nav-icons ms-auto flex-row align-items-center"
      as="ul"
    >
      <ThemeControlDropdown />
      <p className='m-3'>{user_first_name} {user_last_name}</p>
      <ProfileDropdown />
    </Nav>
  );
};

export default TopNavRightSideNavItem;
