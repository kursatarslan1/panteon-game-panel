import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthSimpleLayout from "../layouts/AuthSimpleLayout";
import MainLayout from "../layouts/MainLayout";
import ErrorLayout from "../layouts/ErrorLayout";

import Error404 from "components/errors/Error404";
import Error500 from "components/errors/Error500";

import SimpleLogin from "components/authentication/simple/Login";
import SimpleLogout from "components/authentication/simple/Logout";
import SimpleRegistration from "components/authentication/simple/Registration";

// Dashboard
import Configuration from "components/dashboards/Home/Configuration";
import ParameterGroups from "components/dashboards/Home/ParameterGroups";
import ParameterDefinitions from "components/dashboards/Home/ParameterDefinitions";
import BuildingParameters from "components/dashboards/Home/BuildingConfigurations";

const PanteonRoutes = () => {
  return (
    <Routes>
      <Route element={<ErrorLayout />}>
        <Route path="errors/404" element={<Error404 />} />
        <Route path="errors/500" element={<Error500 />} />
      </Route>
      {/*- ------------- Authentication ---------------------------  */}

      {/*- ------------- simple ---------------------------  */}
      <Route element={<AuthSimpleLayout />}>
        <Route path="authentication/simple/login" element={<SimpleLogin />} />
        <Route
          path="authentication/simple/register"
          element={<SimpleRegistration />}
        />
        <Route path="authentication/simple/logout" element={<SimpleLogout />} />
      </Route>

      {/* //--- MainLayout Starts  */}

      <Route element={<MainLayout />}>
        {/*Dashboard*/}
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/" element={<Configuration />} />
        <Route path="/parameter-groups" element={<ParameterGroups />} />
        <Route
          path="/parameter-definitions"
          element={<ParameterDefinitions />}
        />
        <Route
          path="/building-configurations"
          element={<BuildingParameters />}
        />
      </Route>

      {/* //--- MainLayout end  */}

      {/* <Navigate to="/errors/404" /> */}
      <Route path="*" element={<Navigate to="/errors/404" replace />} />
    </Routes>
  );
};

export default PanteonRoutes;
