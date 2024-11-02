import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore(); // Access the authentication store
      authStore.signOut(); // Log out the user (implement this in your store)
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
