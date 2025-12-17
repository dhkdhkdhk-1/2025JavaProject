import axios from "axios";

/** axios 기본 인스턴스 */
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
});

/** 토큰 설정 함수 */
export function setAccessToken(token: string | null) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

/** DTO 정의 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  password: string;
  passwordCheck: string;
  restorePosts: boolean;
  rejoinConfirm: boolean;
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

/** ---------------------------
 *   이메일 중복 확인 타입 정의
 * --------------------------- */
export interface CheckEmailResponse {
  rejoin: boolean;
  message: string;
}

/** 이메일 중복 확인 */
export const checkEmail = async (
  email: string
): Promise<CheckEmailResponse> => {
  try {
    const res = await api.post(
      "/auth/check-email",
      { email },
      { headers: { skipAuthInterceptor: "true" } }
    );

    return res.data as CheckEmailResponse;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      return { rejoin: false, message: "既に存在しているメールです。" };
    }
    return { rejoin: false, message: "メール確認中エラーが発生しました。" };
  }
};

/** 로그인 */
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
      alert("脱退されたアカウントです。再加入してください。");
    }
    return null;
  }
};

/** 회원가입 */
export const signup = async (
  data: SignupRequest
): Promise<"OK" | "REJOIN" | "EXISTS" | "NICKNAME_EXISTS" | "FAIL"> => {
  try {
    const res = await api.post("/auth/signup", data, {
      headers: {
        "Content-Type": "application/json",
        skipAuthInterceptor: "true",
      },
    });

    const msg = typeof res.data === "string" ? res.data : res.data?.message;

    if (msg?.includes("REJOIN")) return "REJOIN";
    if (msg?.includes("既に") || msg?.includes("存在")) return "EXISTS";

    return "OK";
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message || "";

      // ⭐ 닉네임 중복 처리 추가
      if (msg.includes("닉네임") || msg.includes("ニックネーム")) {
        return "NICKNAME_EXISTS";
      }

      // 기존 이메일 중복 처리
      if (error.response?.status === 409) {
        return "EXISTS";
      }
    }

    return "FAIL";
  }
};

/** 내 정보 조회 */
export const getMe = async (): Promise<User> => {
  const res = await api.get<User>("/user/me");
  return res.data;
};

/** 회원정보 수정 */
export const updateUserInfo = async (data: {
  username: string;
  password: string;
  passwordCheck: string;
}): Promise<void> => {
  await api.put("/user/me", data, {
    headers: { "Content-Type": "application/json" },
  });
};

/** 액세스 토큰 갱신 */
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
    console.error("トークン更新失敗:", err);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return null;
  }
};

/** ---------------------------
 *     비밀번호 찾기 기능
 * --------------------------- */

/** 인증번호 발송 */
export const sendPasswordResetCode = async (
  email: string
): Promise<"OK" | "NOT_FOUND" | "FAIL"> => {
  try {
    await api.post(
      "/auth/find-password/send-code",
      { email },
      { headers: { skipAuthInterceptor: "true" } }
    );

    return "OK";
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return "NOT_FOUND";
    }
    return "FAIL";
  }
};

/** 인증번호 검증 */
/** 인증번호 검증 */
export const verifyPasswordResetCode = async (
  email: string,
  code: string
): Promise<{ verified: boolean; expired: boolean }> => {
  try {
    const res = await api.post(
      "/auth/find-password/verify-code",
      { email, code },
      { headers: { skipAuthInterceptor: "true" } }
    );

    return {
      verified: res.data.verified === true,
      expired: res.data.expired === true,
    };
  } catch (error) {
    console.error("認証番号確認失敗:", error);
    return { verified: false, expired: true };
  }
};

/** 비밀번호 재설정 */
export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const res = await api.post(
      "/auth/find-password/reset-password",
      { email, newPassword },
      { headers: { skipAuthInterceptor: "true" } }
    );

    return res.data.success === true;
  } catch (error) {
    console.error("パスワード再設定失敗:", error);
    return false;
  }
};

export const sendSignupVerifyCode = async (email: string): Promise<boolean> => {
  try {
    await api.post(
      "/auth/signup/send-code",
      { email },
      { headers: { skipAuthInterceptor: "true" } }
    );
    return true;
  } catch {
    return false;
  }
};

export const verifySignupCode = async (
  email: string,
  code: string
): Promise<{ verified: boolean; expired: boolean }> => {
  try {
    const res = await api.post(
      "/auth/signup/verify-code",
      { email, code },
      { headers: { skipAuthInterceptor: "true" } }
    );

    return {
      verified: res.data.verified === true,
      expired: res.data.expired === true,
    };
  } catch {
    return { verified: false, expired: true };
  }
};

/** 닉네임 중복 확인 */
export const checkUsername = async (
  username: string,
  email?: string
): Promise<{ available: boolean }> => {
  try {
    const res = await api.post(
      "/auth/check-username",
      { username, email },
      { headers: { skipAuthInterceptor: "true" } }
    );

    return res.data;
  } catch {
    return { available: false };
  }
};

/** 재가입 시 게시글 존재 여부 확인 */
export const hasPost = async (email: string): Promise<boolean> => {
  try {
    const res = await api.get(`/board/has-post/${email}`, {
      headers: { skipAuthInterceptor: "true" },
    });
    return res.data === true;
  } catch {
    return false;
  }
};

/** 앱 시작 시 토큰 설정 */
setAccessToken(localStorage.getItem("accessToken"));
