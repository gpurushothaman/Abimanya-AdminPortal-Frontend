import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

export const getDoorSeamlessTexture = () => api.get(ENDPOINTS.DOOR_SEAMLESS_TEXTURE);

export const createDoorSeamlessTexture = (seamlessTextureData) => {
  const config = {};

  if (seamlessTextureData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data'
    };
  }

  return api.post(ENDPOINTS.DOOR_SEAMLESS_TEXTURE, seamlessTextureData, config);
};

export const deleteDoorSeamlessTexture = (id, designValue) =>
  api.delete(`${ENDPOINTS.DOOR_SEAMLESS_TEXTURE}/${id}`, {
    params: {
        designValue      
    }
  });

export const updateDoorSeamlessTexture = (id, data) => api.put(`${ENDPOINTS.DOOR_SEAMLESS_TEXTURE}/${id}`, data);
