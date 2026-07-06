import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const getDoorModels = () => api.get(ENDPOINTS.DOOR_MODEL);

export const updateDoorModel = (id, data) => {
  const config = {};

  if (data instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data'
    };
  }

  return api.put(`${ENDPOINTS.DOOR_MODEL}/${id}`, data, config);
};
