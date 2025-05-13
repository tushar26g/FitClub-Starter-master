// src/utils/authHelper.js
import { jwtDecode } from "jwt-decode";


export const getToken = () => localStorage.getItem("token");

export const decodeToken = () => {
  const token = getToken();
  try {
    return token ? jwtDecode(token) : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // true if expired
  } catch (error) {
    return true;
  }
};

export const getUserRole = () => {
  const decoded = decodeToken();
  return decoded?.role || null;
};
