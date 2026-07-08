import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const getDoorShades = () => api.get(ENDPOINTS.DOOR_SHADE);

export const createDoorShade = (shadeData) => {
  const config = {};

  if (shadeData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data'
    };
  }

  return api.post(ENDPOINTS.DOOR_SHADE, shadeData, config);
};

export const deleteDoorShade = (id, subDesignValue, modelValue) =>
  api.delete(`${ENDPOINTS.DOOR_SHADE}/${id}`, {
    params: {
      subDesignValue,
      modelValue
    }
  });
