import api, { requestData } from "../../services/api.js";

export const budgetsService = {
  getBudgets: (month) => requestData(api.get("/budgets", { params: { month } })),
  saveBudget: (payload) => requestData(api.post("/budgets", payload)),
};
