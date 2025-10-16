import axios, { AxiosError, AxiosRequestConfig } from "axios";

/** ✅ axios 기본 인스턴스 */
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

/** ✅ 토큰 설정 */
export function setAccessToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

/** ✅ 토큰 제거 (로그아웃/실패 시) */
export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  setAccessToken(null);
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

/** ✅ 요청 인터셉터: /auth 요청엔 토큰 제외 */
api.interceptors.request.use((config) => {
  const url = (config.url || "").toLowerCase();
  const isAuth = url.startsWith("/auth");

  if (isAuth) {
    if (config.headers) delete (config.headers as any)["Authorization"];
  } else {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  }

  return config;
});

/** ✅ 응답 인터셉터: 401 발생 시 자동 토큰 재발급 */
let isRefreshing = false;
let queue: Array<{ resolve: () => void; reject: (e?: any) => void }> = [];

async function refreshTokenRequest() {
  if (isRefreshing)
    return new Promise<void>((res, rej) =>
      queue.push({ resolve: res, reject: rej })
    );

  isRefreshing = true;
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");

    const res = await api.post<TokenResponse>("/auth/refresh", {
      refreshToken,
    });

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    setAccessToken(res.data.accessToken);

    queue.forEach((p) => p.resolve());
  } catch (e) {
    clearTokens();
    queue.forEach((p) => p.reject(e));
    throw e;
  } finally {
    queue = [];
    isRefreshing = false;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const url = (original?.url || "").toLowerCase();
    const isAuth = url.startsWith("/auth");

    if (status === 401 && original && !original._retry && !isAuth) {
      original._retry = true;
      try {
        await refreshTokenRequest();
        return api(original);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

//여기서부터는 인증 관련 API

/** ✅ 로그인 API */
export const login = async (
  data: LoginRequest
): Promise<TokenResponse | null> => {
  try {
    setAccessToken(null); // 혹시 남은 토큰 제거
    const res = await api.post<TokenResponse>("/auth", data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "로그인 실패: 이메일 또는 비밀번호를 확인하세요.";
    console.error("❌ 로그인 실패:", msg);
    alert(msg);
    return null;
  }
};

/** ✅ 회원가입 API */
export const signup = async (data: SignupRequest): Promise<boolean> => {
  try {
    const payload = {
      email: data.email,
      username: data.username,
      password: data.password,
      passwordCheck: data.passwordCheck,
      phone: data.phone,
    };

    await axios.post("http://localhost:8080/auth/signup", payload, {
      headers: { "Content-Type": "application/json" },
    });
    alert("회원가입이 완료되었습니다!");
    return true;
  } catch (error) {
    console.error("회원가입 실패:", error);
    alert("회원가입 중 오류가 발생했습니다.");
    return false;
  }
};

/** ✅ 이메일 중복확인 API */
export const checkEmail = async (email: string): Promise<boolean> => {
  try {
    const res = await axios.post<{ message: string }>(
      "http://localhost:8080/auth/check-email",
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
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

/** ✅ 휴대폰 인증 API */
export const verifyPhone = async (phone: string): Promise<boolean> => {
  try {
    const res = await axios.post<{ message: string }>(
      "http://localhost:8080/auth/verify-phone",
      { phone },
      { headers: { "Content-Type": "application/json" } }
    );
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

/** ✅ 로그인된 사용자 정보 조회 */
export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/user/me");
  return res.data;
};

/** ✅ 앱 시작 시 저장된 토큰 다시 세팅 */
setAccessToken(localStorage.getItem("accessToken"));
