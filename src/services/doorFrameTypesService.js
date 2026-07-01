import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorFrameTypes = () =>
    api.get(ENDPOINTS.DOOR_FRAME_TYPES);

export const updateDoorFrameType = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_FRAME_TYPES}/${id}`,data);
