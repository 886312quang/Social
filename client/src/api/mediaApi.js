import axios from "axios";
import { isAuthenticated } from "../components/Shared/Routes/permissionChecker";

const mediaApi = axios.create({
  baseURL: `${process.env.REACT_APP_API_URI}`,
});

mediaApi.interceptors.request.use(
  (config) => {
    if (isAuthenticated()) {
      config.headers["Authorization"] = "Bearer " + isAuthenticated();
    }
    config.headers["Content-Type"] =
      "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s";
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

export default mediaApi;
