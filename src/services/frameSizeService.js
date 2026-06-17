import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

export const getFrameSize = () =>
  api.get(ENDPOINTS.FRAME_SIZE);

export const createFrameSize = (data) =>
  api.post(ENDPOINTS.FRAME_SIZE, data);

export const updateFrameSize = (id, data) =>
  api.put(`${ENDPOINTS.FRAME_SIZE}/${id}`, data);

export const deleteFrameSize = (id) =>
  api.delete(`${ENDPOINTS.FRAME_SIZE}/${id}`);