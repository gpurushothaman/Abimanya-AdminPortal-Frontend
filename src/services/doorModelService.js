import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorModels = () =>
  api.get(ENDPOINTS.DOOR_MODEL);

export const updateDoorModel = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_MODEL}/${id}`, data);