import axios, { AxiosError } from "axios";

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

/** ✅ 로그인 API */
export const login = async (
  data: LoginRequest
): Promise<TokenResponse | null> => {
  try {
    const res = await api.post<TokenResponse>("/auth", data);
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setAccessToken(res.data.accessToken);
    return res.data;
  } catch (error) {
    console.error("❌ 로그인 실패:", error);
    alert("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
    return null;
  }
};

/** ✅ 회원가입 API */
export const signup = async (data: SignupRequest): Promise<boolean> => {
  try {
    await api.post("/auth/signup", data, {
      headers: { "Content-Type": "application/json" },
    });
    alert("회원가입이 완료되었습니다!");
    return true;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      alert("이미 사용 중인 이메일입니다.");
    } else {
      alert("회원가입 중 서버 오류가 발생했습니다.");
      console.error("회원가입 실패:", error);
    }
    return false;
  }
};

/** ✅ 이메일 중복확인 API */
export const checkEmail = async (email: string): Promise<boolean> => {
  try {
    const res = await api.post(
      "/auth/check-email",
      { email },
      { headers: { skipAuthInterceptor: "true" } }
    );
    return res.status === 200;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 409)
      alert("이미 등록된 이메일입니다.");
    else alert("이메일 중복확인 중 오류가 발생했습니다.");
    console.error("이메일 확인 실패:", error);
    return false;
  }
};

/** ✅ 휴대폰 인증 API */
export const verifyPhone = async (phone: string): Promise<boolean> => {
  try {
    const res = await api.post(
      "/auth/verify-phone",
      { phone },
      { headers: { skipAuthInterceptor: "true" } }
    );
    return res.status === 200;
  } catch (error: any) {
    console.error("전화번호 인증 실패:", error);
    alert("전화번호 인증 중 오류가 발생했습니다.");
    return false;
  }
};

/** ✅ 내 정보 조회 */
export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/user/me");
  return res.data;
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

    // ✅ 새 토큰을 전역 Axios에 반영
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${res.data.accessToken}`;
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

/** ✅ Axios 인터셉터 */
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token!)
  );
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config: any }) => {
    const originalRequest = error.config;

    if (originalRequest.headers?.skipAuthInterceptor === "true") {
      delete originalRequest.headers.skipAuthInterceptor;
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) =>
          failedQueue.push({ resolve, reject })
        ).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("토큰 갱신 실패");

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** ✅ 앱 시작 시 저장된 토큰 적용 */
setAccessToken(localStorage.getItem("accessToken"));
