import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getAllDoorThickness = () =>
  api.get(ENDPOINTS.DOOR_THICKNESS);

export const updateDoorThickness = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_THICKNESS}/${id}`, data);

