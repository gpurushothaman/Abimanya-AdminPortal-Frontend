import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getAllDoorJambLocation = () =>
  api.get(ENDPOINTS.DOOR_JAMB_LOCATION);

export const updateDoorJambLocation = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_JAMB_LOCATION}/${id}`, data);