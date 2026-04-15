import api, { requestData } from "../../services/api.js";

export const transactionsService = {
  getTransactions: (params) => requestData(api.get("/transactions", { params })),
  createTransaction: (payload) => requestData(api.post("/transactions", payload)),
  deleteTransaction: (transactionId) => requestData(api.delete(`/transactions/${transactionId}`)),
};
