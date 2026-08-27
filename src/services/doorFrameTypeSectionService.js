import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getADoorFrameSections = () =>
    api.get(ENDPOINTS.DOOR_FRAME_SECTION);

export const updateDoorFrameSection = (id, data) =>
  api.put(`${ENDPOINTS.DOOR_FRAME_SECTION}/${id}`,data);
