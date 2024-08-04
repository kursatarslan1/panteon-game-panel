import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import classNames from "classnames";
import NavbarTop from "components/navbar/top/NavbarTop";
import NavbarVertical from "components/navbar/vertical/NavbarVertical";
import Footer from "components/footer/Footer";

import { useAppContext } from "Main";

const MainLayout = () => {
  const {
    config: { isFluid, navbarPosition },
  } = useAppContext();

  return (
    <div className={isFluid ? "container-fluid" : "container"}>
      {(navbarPosition === "vertical" || navbarPosition === "combo") && (
        <NavbarVertical />
      )}
      <div className={classNames("content")}>
        <NavbarTop />
        {/*------ Main Routes ------*/}
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
