import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

export function setAccessToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
}

// ✅ 로그인 API
export const login = async (
  data: LoginRequest
): Promise<TokenResponse | null> => {
  try {
    const res = await api.post<TokenResponse>("/auth", data);
    return res.data;
  } catch (error) {
    console.error("로그인 실패:", error);
    return null;
  }
};

// ✅ 회원가입 API
export const signup = async (data: SignupRequest): Promise<boolean> => {
  try {
    await api.post("/auth/signup", data);
    return true;
  } catch (error) {
    console.error("회원가입 실패:", error);
    return false;
  }
};

// ✅ 이메일 중복확인 API
export const checkEmail = async (email: string): Promise<boolean> => {
  try {
    const res = await api.post("/auth/check-email", { email });
    alert(res.data?.message || "사용 가능한 이메일입니다.");
    return true;
  } catch (error: any) {
    console.error("이메일 중복확인 실패:", error);
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("이메일 확인 중 오류가 발생했습니다.");
    }
    return false;
  }
};

// ✅ 휴대폰 인증 API
export const verifyPhone = async (phone: string): Promise<boolean> => {
  try {
    const res = await api.post("/auth/verify-phone", { phone });
    alert(res.data?.message || "인증번호가 전송되었습니다.");
    return true;
  } catch (error: any) {
    console.error("휴대폰 인증 실패:", error);
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("휴대폰 인증 중 오류가 발생했습니다.");
    }
    return false;
  }
};

// ✅ 로그인된 사용자 정보 조회
export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/user/me");
  return res.data;
};

setAccessToken(localStorage.getItem("accessToken"));
