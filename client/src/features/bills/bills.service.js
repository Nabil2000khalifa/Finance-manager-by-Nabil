import api, { requestData } from "../../services/api.js";

export const billsService = {
  getBills: () => requestData(api.get("/bills")),
  createBill: (payload) => requestData(api.post("/bills", payload)),
};
