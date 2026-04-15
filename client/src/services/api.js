import axios from "axios";

import { getErrorMessage } from "../utils/formatters.js";
import { STORAGE_KEYS } from "../utils/storage.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

export const requestData = async (request) => {
  try {
    const { data } = await request;
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
