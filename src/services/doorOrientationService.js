import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorOrientation = () =>
  api.get(ENDPOINTS.DOOR_ORIENTATION);

export const updateDoorOrientation = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_ORIENTATION}/${id}`, data);

