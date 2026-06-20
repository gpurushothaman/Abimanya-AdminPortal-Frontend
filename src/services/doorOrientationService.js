import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorOrientation = () =>
  api.get(ENDPOINTS.DOOR_ORIENTATION);

export const getDoorOrientationById = (id) =>
  api.get(`${ENDPOINTS.DOOR_ORIENTATION}/${id}`);

export const createDoorOrientation = (data) =>
  api.post(ENDPOINTS.DOOR_ORIENTATION, data);

export const updateDoorOrientation = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_ORIENTATION}/${id}`, data);

export const deleteDoorOrientation = (id) =>
  api.delete(`${ENDPOINTS.DOOR_ORIENTATION}/${id}`);