import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getAllDimension = () => api.get(ENDPOINTS.DIMENSION);

export const updateDimension = (id, data) =>
  api.put(`${ENDPOINTS.DIMENSION}/${id}`, data);
