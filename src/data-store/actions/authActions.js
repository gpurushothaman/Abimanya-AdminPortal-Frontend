import { LOGIN_SUCCESS, LOGOUT } from "../constants/authConstants";

export const login = (token) => {
  localStorage.setItem("token", token);
  
  return {
    type: LOGIN_SUCCESS,
    payload: token,
  };
};

export const logout = () => {
  localStorage.removeItem("token");

  return {
    type: LOGOUT,
  };
};