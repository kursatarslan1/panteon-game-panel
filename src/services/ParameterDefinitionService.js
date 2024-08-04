import axios, { URL } from "../constants/api/axios";

let cachedParameterDefinitionList = {};
let cachedParameterValues = {};
const ParameterDefinitionService = {
  createParameterDefinition: async (data) => {
    const response = await axios.post(URL.createParameterDefinition, data);
    // Clear cache
    cachedParameterDefinitionList = {};
    return response.data;
  },

  getParameterDefinitionList: async () => {
    if (cachedParameterDefinitionList["all"]) {
      return cachedParameterDefinitionList["all"];
    }
    const response = await axios.get(URL.parameterDefinitionList);
    cachedParameterDefinitionList["all"] = response.data;
    return response.data;
  },

  getParameterValuesByParameterNames: async (name) => {
    if (cachedParameterValues[`${name}`]) {
      return cachedParameterValues[`${name}`];
    }
    const response = await axios.get(
      URL.getParameterValueByParameterName.replace(":name", name)
    );
    cachedParameterValues[`${name}`] = response.data;
    return response.data;
  },

  updateParameterDefinition: async (id, data) => {
    const response = await axios.put(
      URL.updateParameterDefinition.replace(":id", id),
      data
    );
    // Clear cache
    cachedParameterDefinitionList = {};
    return response.data;
  },

  deleteParameterDefinition: async (id) => {
    const response = await axios.delete(
      URL.deleteParameterDefinition.replace(":id", id)
    );
    // Clear cache
    cachedParameterDefinitionList = {};
    return response.data;
  },
};

export default ParameterDefinitionService;
