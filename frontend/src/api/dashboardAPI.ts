import { api } from "./AuthApi";

const BASE_URL = process.env.REACT_APP_API_BASE_URL; // 나중에 Spring 서버 주소로 변경

export async function fetchDashboardData() {
  try {
    const res = await api.get(`${BASE_URL}/dashboard`);
    return res.data;
  } catch (err) {
    console.error("대시 보드 데이터 불러오기 실패:", err);
    return null;
  }
}
