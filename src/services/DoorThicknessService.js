import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorThickness = () =>
  api.get(ENDPOINTS.DOOR_THICKNESS);

export const getDoorThicknessById = (id) =>
  api.get(`${ENDPOINTS.DOOR_THICKNESS}/${id}`);

export const createDoorThickness = (data) =>
  api.post(ENDPOINTS.DOOR_THICKNESS, data);

export const updateDoorThickness = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_THICKNESS}/${id}`, data);

export const deleteDoorThickness = (id) =>
  api.delete(`${ENDPOINTS.DOOR_THICKNESS}/${id}`);