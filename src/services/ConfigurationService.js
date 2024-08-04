import axios, { URL } from "../constants/api/axios";

let cachedConfigurationList = {};
const ConfigurationService = {
  createConfiguration: async (data) => {
    const response = await axios.post(URL.createConfiguration, data);
    // Clear cache
    cachedConfigurationList = {};
    return response.data;
  },

  getConfigurationList: async () => {
    if (cachedConfigurationList["all"]) {
      return cachedConfigurationList["all"];
    }
    const response = await axios.get(URL.configurationList);
    cachedConfigurationList["all"] = response.data;
    return response.data;
  },

  updateConfiguration: async (id, data) => {
    const response = await axios.put(
      URL.updateConfiguration.replace(":id", id),
      data
    );
    // Clear cache
    cachedConfigurationList = {};
    return response.data;
  },

  deleteConfiguration: async (id) => {
    const response = await axios.delete(
      URL.deleteConfiguration.replace(":id", id)
    );
    // Clear cache
    cachedConfigurationList = {};
    return response.data;
  },
};

export default ConfigurationService;
