import axios from "axios";

/** ✅ axios 기본 인스턴스 */
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
});

/** ✅ 토큰 설정 함수 */
export function setAccessToken(token: string | null) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

/** ✅ DTO 정의 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  passwordCheck: string;
  restorePosts?: boolean;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  deleted: boolean;
}

/** ✅ 로그인 */
export const login = async (
  data: LoginRequest
): Promise<TokenResponse | null> => {
  try {
    const res = await api.post<TokenResponse>("/auth", data, {
      headers: { skipAuthInterceptor: "true" },
    });
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setAccessToken(res.data.accessToken);
    return res.data;
  } catch (error: any) {
    if (
      axios.isAxiosError(error) &&
      error.response?.data?.message?.includes("탈퇴")
    ) {
      alert("탈퇴된 계정입니다. 재가입 후 이용해주세요.");
    } else {
      alert("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
    }
    return null;
  }
};

/** ✅ 회원가입 */
export const signup = async (
  data: SignupRequest
): Promise<"OK" | "REJOIN" | "EXISTS" | "FAIL"> => {
  try {
    const res = await api.post("/auth/signup", data, {
      headers: {
        "Content-Type": "application/json",
        skipAuthInterceptor: "true",
      },
    });

    const msg = (res.data || "").toString().toLowerCase();
    if (msg.includes("재가입") || msg.includes("복구")) return "REJOIN";
    if (msg.includes("이미") || msg.includes("존재")) return "EXISTS";
    return "OK";
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      return "EXISTS";
    }
    console.error("회원가입 실패:", error);
    return "FAIL";
  }
};

/** ✅ 이메일 중복확인 */
export const checkEmail = async (
  email: string
): Promise<"OK" | "REJOIN" | "DUPLICATE" | "FAIL"> => {
  try {
    const res = await api.post(
      "/auth/check-email",
      { email },
      { headers: { skipAuthInterceptor: "true" } }
    );

    if (res.data?.rejoin === true) {
      const confirmRejoin = window.confirm(res.data.message);
      return confirmRejoin ? "REJOIN" : "FAIL";
    }

    alert(res.data.message || "✅ 사용 가능한 이메일입니다.");
    return "OK";
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      alert("이미 등록된 이메일입니다.");
      return "DUPLICATE";
    }
    console.error("이메일 확인 실패:", error);
    alert("이메일 중복확인 중 오류가 발생했습니다.");
    return "FAIL";
  }
};

/** ✅ 내 정보 조회 */
export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/user/me");
  return res.data;
};

/** ✅ 회원정보 수정 (닉네임 변경 + 비밀번호 확인) */
export const updateUserInfo = async (data: {
  username: string;
  password: string;
  passwordCheck: string;
}): Promise<void> => {
  try {
    await api.put("/user/me/v2", data, {
      // ✅ v2 경로
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("회원정보 수정 실패:", error);
    throw error;
  }
};

/** ✅ 액세스 토큰 갱신 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await axios.post<{ accessToken: string; refreshToken: string }>(
      `${
        process.env.REACT_APP_API_BASE_URL || "http://localhost:8080"
      }/auth/refresh`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          skipAuthInterceptor: "true",
        },
      }
    );

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setAccessToken(res.data.accessToken);
    return res.data.accessToken;
  } catch (err) {
    console.error("❌ 토큰 갱신 실패:", err);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return null;
  }
};

/** ✅ 요청 인터셉터 (중복 제거) */
api.interceptors.request.use((config) => {
  if (config.headers?.skipAuthInterceptor === "true") {
    delete config.headers.skipAuthInterceptor;
    delete config.headers.Authorization;
    return config;
  }

  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** ✅ 앱 시작 시 저장된 토큰 적용 */
setAccessToken(localStorage.getItem("accessToken"));
