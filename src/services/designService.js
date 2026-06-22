import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDesigns = () =>
  api.get(ENDPOINTS.DESIGN);

export const getDesignById = (id) =>
  api.get(`${ENDPOINTS.DESIGN}/${id}`);

export const createDesigns = (doors) =>
  api.post(ENDPOINTS.DESIGN, doors);

export const updateDesign = (id, data) =>
  api.put(`${ENDPOINTS.DESIGN}/${id}`, data);

export const deleteDesign = (id) =>
  api.delete(`${ENDPOINTS.DESIGN}/${id}`);