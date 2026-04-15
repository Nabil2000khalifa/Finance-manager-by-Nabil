import api, { requestData } from "../../services/api.js";

export const settingsService = {
  getProfile: () => requestData(api.get("/settings/profile")),
  updateProfile: (payload) => requestData(api.put("/settings/profile", payload)),
  updateCurrency: (payload) => requestData(api.put("/settings/currency", payload)),
};
