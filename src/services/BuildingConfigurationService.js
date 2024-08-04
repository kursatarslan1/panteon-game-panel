import axios, { URL } from "../constants/api/axios";

let cachedBuildingConfiguration = {};
const BuildingConfigurationService = {
  createBuildingConfiguration: async (data) => {
    try {
      const response = await axios.post(URL.createBuildingConfiguration, data);
      // Clear cache
      cachedBuildingConfiguration = {};
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getBuildingConfigurationList: async () => {
    if (cachedBuildingConfiguration["all"]) {
      return cachedBuildingConfiguration["all"];
    }
    try {
      const response = await axios.get(URL.buildingConfigurationList);
      cachedBuildingConfiguration["all"] = response.data;
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateBuildingConfiguration: async (id, data) => {
    try {
      const response = await axios.put(
        URL.updateBuildingConfiguration.replace(":id", id),
        data
      );
      // Clear cache
      cachedBuildingConfiguration = {};
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  deleteBuildingConfiguration: async (id) => {
    try {
      const response = await axios.delete(
        URL.deleteBuildingConfiguration.replace(":id", id)
      );
      // Clear cache
      cachedBuildingConfiguration = {};
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

const handleError = (error) => {
  throw new Error(
    error.response?.data?.message ||
      "BuildingCost > 0 ve 30 < ConstructionTime < 1800 olmalıdır."
  );
};

export default BuildingConfigurationService;
