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
      error.response?.data?.message?.includes("脱退")
    ) {
      alert("脱退されたアカウントです。再加入した後に利用してください。");
    } else {
      alert("ログイン失敗：メールまたはパスワードを確認してください。");
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
    if (msg.includes("再加入") || msg.includes("復元")) return "REJOIN";
    if (msg.includes("既に") || msg.includes("存在")) return "EXISTS";
    return "OK";
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      return "EXISTS";
    }
    console.error("会員登録失敗:", error);
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

    alert(res.data.message || "✅ 使用可能なメールです。");
    return "OK";
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      alert("既に登録されたメールです。");
      return "DUPLICATE";
    }
    console.error("メール確認失敗:", error);
    alert("メールの重複確認中エラーが発生しました。");
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
    await api.put("/user/me", data, {
      // ✅ v2 경로
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("会員譲歩修正失敗:", error);
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
    console.error("❌ トークンの更新失敗:", err);
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

/** ✅ 비밀번호 찾기: 인증번호 발송 */
export const sendPasswordResetCode = async (
  email: string
): Promise<"OK" | "NOT_FOUND" | "FAIL"> => {
  try {
    const res = await api.post(
      "/auth/find-password/send-code",
      { email },
      { headers: { skipAuthInterceptor: "true" } }
    );

    alert(res.data.message || "認証番号が送信されました。");
    return "OK";
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      alert("登録されていないメールです。");
      return "NOT_FOUND";
    }

    alert("認証番号送信中にエラーが発生しました。");
    return "FAIL";
  }
};

/** ✅ 비밀번호 찾기: 인증번호 검증 */
export const verifyPasswordResetCode = async (
  email: string,
  code: string
): Promise<boolean> => {
  try {
    const res = await api.post(
      "/auth/find-password/verify-code",
      { email, code },
      { headers: { skipAuthInterceptor: "true" } }
    );

    return res.data.verified === true;
  } catch (error) {
    console.error("認証番号確認失敗:", error);
    return false;
  }
};

/** ✅ 앱 시작 시 저장된 토큰 적용 */
setAccessToken(localStorage.getItem("accessToken"));
