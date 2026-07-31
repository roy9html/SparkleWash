import axios from "axios";

const api = axios.create({
  baseURL: "https://sparklewash-8v9d.onrender.com",  // <-- hardcoded
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem("accessToken");
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      }
    }
    return Promise.reject(error);
  }
);

export default api;