import axios from "axios";
import { store } from "@/redux/store";
import { setAccessToken, clearAccessToken } from "@/slices/authSlice";
import { getBackendUrl } from "@/utils/getBackendUrl";

const api = axios.create({
  baseURL: getBackendUrl(),
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh_access_token")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${getBackendUrl()}/auth/refresh_access_token`,
          {},
          { withCredentials: true }
        );
        
        console.log("Refresh token response:", res.data);
        
        if (!res.data?.jwt_token) {
          throw new Error("No token in refresh response");
        }
        
        store.dispatch(setAccessToken(res.data));
        const newAccessToken = res.data.jwt_token;
        
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed:", err);
        store.dispatch(clearAccessToken());
        window.location.href = "/login";
        return Promise.reject(error); // Important to prevent further processing
      }
    }

    return Promise.reject(error);
  }
);

export default api;