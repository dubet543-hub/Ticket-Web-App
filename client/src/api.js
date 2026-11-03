import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// An expired or old login token: clear the session and show the login screen again
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && !error.config?.url?.includes("/users/login")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default API;
