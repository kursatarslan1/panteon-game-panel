import axios, { URL } from "../constants/api/axios";

let cachedParameterGroupList = {};
let cachedParameterNames = {};
const ParameterGroupService = {
  createParameterGroup: async (data) => {
    const response = await axios.post(URL.createParameterGroup, data);
    // Clear cache
    cachedParameterGroupList = {};
    return response.data;
  },

  getParameterGroupList: async () => {
    if (cachedParameterGroupList["all"]) {
      return cachedParameterGroupList["all"];
    }
    const response = await axios.get(URL.parameterGroupList);
    cachedParameterGroupList["all"] = response.data;
    return response.data;
  },

  getParameterNamesByConfigurationName: async (name) => {
    if (cachedParameterNames[`${name}`]) {
      return cachedParameterNames[`${name}`];
    }
    const response = await axios.get(
      URL.getParameterNamesByConfigurationName.replace(":name", name)
    );
    cachedParameterNames[`${name}`] = response.data;
    return response.data;
  },

  updateParameterGroup: async (id, data) => {
    const response = await axios.put(
      URL.updateParameterGroup.replace(":id", id),
      data
    );
    // Clear cache
    cachedParameterGroupList = {};
    return response.data;
  },

  deleteParameterGroup: async (id) => {
    const response = await axios.delete(
      URL.deleteParameterGroup.replace(":id", id)
    );
    // Clear cache
    cachedParameterGroupList = {};
    return response.data;
  },
};

export default ParameterGroupService;
