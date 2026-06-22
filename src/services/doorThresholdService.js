import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorThreshold = () =>
  api.get(ENDPOINTS.DOOR_THRESHOLD);

export const createDoorThreshold = (data) =>
  api.post(ENDPOINTS.DOOR_THRESHOLD,data);

export const updateDoorThreshold = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_THRESHOLD}/${id}`,data);
