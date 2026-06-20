import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getJambLocation = () =>
  api.get(ENDPOINTS.DOOR_JAMB_LOCATION);

export const createJambLocation = (data) =>
  api.post(ENDPOINTS.DOOR_JAMB_LOCATION, data);

export const updateJambLocation = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_JAMB_LOCATION}/${id}`, data);