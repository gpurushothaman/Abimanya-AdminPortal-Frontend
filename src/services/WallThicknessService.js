import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getWallThickness = () =>
  api.get(ENDPOINTS.WALL_THICKNESS);

export const getWallThicknessById = (id) =>
  api.get(`${ENDPOINTS.WALL_THICKNESS}/${id}`);

export const createWallThickness = (data) =>
  api.post(ENDPOINTS.WALL_THICKNESS, data);

export const updateWallThickness = (id, data) =>
  api.put(`${ENDPOINTS.WALL_THICKNESS}/${id}`, data);

export const deleteWallThickness = (id) =>
  api.delete(`${ENDPOINTS.WALL_THICKNESS}/${id}`);