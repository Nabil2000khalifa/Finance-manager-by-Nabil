import api, { requestData } from "../../services/api.js";

export const dashboardService = {
  getSummary: () => requestData(api.get("/dashboard/summary")),
};
