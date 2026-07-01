import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getDoorFrameTypeOptions = () =>
    api.get(ENDPOINTS.DOOR_FRAME_TYPE_OPTIONS);

export const updateDoorFrameTypeOption = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_FRAME_TYPE_OPTIONS}/${id}`,data);
