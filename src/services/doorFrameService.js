import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorFrame = () =>
    api.get(ENDPOINTS.DOOR_FRAME);

export const createDoorFrame = (data) =>
  api.post(ENDPOINTS.DOOR_FRAME, data);

export const updateDoorFrame = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_FRAME}/${id}`,data);
