import axios from "axios";

// ✅ Axios 인스턴스 생성 (기본 URL 한 번만 정의)
export const api = axios.create({
  baseURL: "http://localhost:8080",
});

// ✅ 토큰 설정 함수 (앱 시작 시나 로그인 직후 호출)
export function setAccessToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// ✅ 로그인 요청 DTO
export interface LoginRequest {
  email: string;
  password: string;
}

// ✅ 로그인 응답 DTO
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ✅ 사용자 정보 DTO (백엔드 User DTO와 동일하게)
export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
}

/**
 * ✅ 로그인 API
 * - 성공 시 토큰 반환
 */
export const login = async (
  data: LoginRequest
): Promise<TokenResponse | null> => {
  try {
    const res = await api.post<TokenResponse>("/auth", data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    return null;
  }
};

/**
 * ✅ 현재 로그인한 사용자 정보 조회
 * - Authorization 헤더에 토큰 필요
 */
export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/user/me");
  return res.data;
};

// ✅ 앱이 시작될 때(localStorage에 토큰이 있으면) 자동으로 Authorization 세팅
setAccessToken(localStorage.getItem("accessToken"));
