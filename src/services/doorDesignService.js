import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorDesigns = () =>
  api.get(ENDPOINTS.DOOR_DESIGN);

export const updateDoorDesigns = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_DESIGN}/${id}`, data);

