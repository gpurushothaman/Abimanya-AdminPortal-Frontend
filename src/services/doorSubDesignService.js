import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorSubDesign = () =>
  api.get(ENDPOINTS.DOOR_SUB_DESIGN);

export const updateDoorSubDesign = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_SUB_DESIGN}/${id}`, data);