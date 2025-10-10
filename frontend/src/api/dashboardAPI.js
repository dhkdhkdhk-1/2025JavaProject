import axios from "axios";

const BASE_URL = "http://localhost:8080/api"; // 나중에 Spring 서버 주소로 변경

export async function fetchDashboardData() {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard`);
    return res.data;
  } catch (err) {
    console.error("대시보드 데이터 불러오기 실패:", err);
    return null;
  }
}
