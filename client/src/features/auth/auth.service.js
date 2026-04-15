import api, { requestData } from "../../services/api.js";

export const authService = {
  register: (payload) => requestData(api.post("/auth/register", payload)),
  login: (payload) => requestData(api.post("/auth/login", payload)),
  getCurrentUser: () => requestData(api.get("/auth/me")),
};
