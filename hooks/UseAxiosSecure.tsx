import axios from "axios";

const axiosSecure = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `${token}`;
  return config;
});
export default axiosSecure;
