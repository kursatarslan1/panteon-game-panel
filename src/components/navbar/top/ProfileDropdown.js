import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useAppContext } from "Main";

const ProfileDropdown = () => {
  const username = localStorage.getItem("username");
  const { setConfig } = useAppContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  const handleSetCustomize = () => {
    setConfig("showSettingPanel", true);
  };

  return (
    <Dropdown navbar={true} as="li">
      <Dropdown.Toggle
        bsPrefix="toggle"
        as={Link}
        to="#!"
        className="pe-3 ps-2 nav-link"
      >
        {username}
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-caret dropdown-menu-card  dropdown-menu-end">
        <div className="bg-white rounded-2 py-2 dark__bg-1000">
          <Dropdown.Item
            onClick={handleLogout}
            as={Link}
            to="/authentication/simple/logout"
          >
            Çıkış Yap
          </Dropdown.Item>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
