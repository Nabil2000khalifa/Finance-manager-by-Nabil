import api, { requestData } from "../../services/api.js";

export const accountsService = {
  getAccounts: () => requestData(api.get("/accounts")),
  createAccount: (payload) => requestData(api.post("/accounts", payload)),
  transferBetweenAccounts: (payload) => requestData(api.post("/accounts/transfer", payload)),
};
