import axios from "axios";

export const baseURL = process.env.REACT_APP_HOST_URL;

export default axios.create({ baseURL });

export const URL = {
  //auth

  register: "/api/Auth/register",
  login: "/api/Auth/login",
  userinfo: "/api/Auth/userinfo",

  //Configuration
  configurationList: "/api/Configuration",
  createConfiguration: "/api/Configuration",
  getConfigurationById: "/api/Configuration/:id",
  updateConfiguration: "/api/Configuration/:id",
  deleteConfiguration: "/api/Configuration/:id",

  //Parameter Definition
  parameterDefinitionList: "/api/ParameterDefinition",
  createParameterDefinition: "/api/ParameterDefinition",
  getParameterDefinitionById: "/api/ParameterDefinition/:id",
  getParameterValueByParameterName:
    "/api/ParameterDefinition/ParameterName/:name",
  updateParameterDefinition: "/api/ParameterDefinition/:id",
  deleteParameterDefinition: "/api/ParameterDefinition/:id",

  //Parameter Group
  parameterGroupList: "/api/ParameterGroup",
  createParameterGroup: "/api/ParameterGroup",
  getParameterGroupById: "/api/ParameterGroup/:id",
  getParameterNamesByConfigurationName:
    "/api/ParameterGroup/ByConfigurationName/:name",
  updateParameterGroup: "/api/ParameterGroup/:id",
  deleteParameterGroup: "/api/ParameterGroup/:id",

  //Building Configuration
  buildingConfigurationList: "/api/BuildingConfiguration",
  createBuildingConfiguration: "/api/BuildingConfiguration",
  getBuildingConfigurationById: "/api/BuildingConfiguration/:id",
  updateBuildingConfiguration: "/api/BuildingConfiguration/:id",
  deleteBuildingConfiguration: "/api/BuildingConfiguration/:id",
};
