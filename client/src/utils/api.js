import axios from "axios";

let baseUrl = "/api";
if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
  baseUrl = import.meta.env.VITE_API_URL;
}

const api = axios.create({ baseUrl, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;
