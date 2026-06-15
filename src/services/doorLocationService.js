import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorLocations = () =>
  api.get(ENDPOINTS.DOOR_LOCATION);

export const getDoorLocationById = (id) =>
  api.get(`${ENDPOINTS.DOOR_LOCATION}/${id}`);

export const createDoorLocations = (doors) =>
  api.post(ENDPOINTS.DOOR_LOCATION, doors);

export const updateDoorLocation = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_LOCATION}/${id}`, data);

export const deleteDoorLocation = (id) =>
  api.delete(`${ENDPOINTS.DOOR_LOCATION}/${id}`);