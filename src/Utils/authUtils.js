import { jwtDecode } from "jwt-decode";
import axios from "axios";
import memberService from "../service/memberService";

export const checkAndRefreshTokenIfOld = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    const issuedAt = decoded.iat * 1000;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    if (now - issuedAt > thirtyDays) {
      await memberService.refreshAccessToken();
    }
  } catch (err) {
    console.error("Token check/refresh failed", err);
  }
};
