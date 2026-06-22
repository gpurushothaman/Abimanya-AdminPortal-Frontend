import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorJambLocation = () =>
  api.get(ENDPOINTS.DOOR_JAMB_LOCATION);

export const createDoorJambLocation = (data) =>
  api.post(ENDPOINTS.DOOR_JAMB_LOCATION, data);

export const updateDoorJambLocation = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_JAMB_LOCATION}/${id}`, data);