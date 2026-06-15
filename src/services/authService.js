import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const authlogin = (data) => {
  return api.post(ENDPOINTS.LOGIN, data);
};

export const register = (data) => {
  return api.post(ENDPOINTS.REGISTER, data);
};