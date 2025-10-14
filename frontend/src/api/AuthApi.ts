import axios from "axios";

const API_BASE_URL = "http://localhost:8080/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * 로그인 요청
 */
export const login = async (
  data: LoginRequest
): Promise<TokenResponse | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    return null;
  }
};
