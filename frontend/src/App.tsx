// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { setAccessToken } from "./api/AuthApi"; // ✅ 추가

// ✅ Layouts
import Layout from "./layout/Layout";
import AdminLayout from "./layout/admin/AdminLayout";

// ✅ 사용자 페이지
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import BookList from "./pages/booklist/BookList";
import BookInfo from "./pages/bookinfo/BookInfo";
import TotalReview from "./pages/review/totalreview/TotalReview";
import RentalList from "./pages/rental/RentalList";
import WishList from "./pages/wishlist/WishList";
import ReviewList from "./pages/review/reviewlist/ReviewList";
import WriteReview from "./pages/review/writereview/WriteReview"; // ✅ 추가

// ✅ 관리자 페이지
import Dashboard from "./pages/admin/Dashboard";
import BookManager from "./pages/admin/BookManager";
import MyPage from "./pages/mypage/MyPage";

/** ✅ 로그인 가드 (일반 사용자용) */
const ProtectedLayout: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;
  return <Layout />;
};

/** ✅ 관리자 가드 (ADMIN만 접근 허용) */
const AdminLayoutGuard: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/home" replace />;
  return <AdminLayout />;
};

/** ✅ App */
const App: React.FC = () => {
  // ✅ 앱이 실행될 때 항상 토큰을 axios에 세팅 (로그인 유지 보장)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 비로그인 접근 가능 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ 로그인된 사용자 영역 */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/MyPage" element={<MyPage />} />

          {/* ✅ 도서 목록 및 상세 */}
          <Route path="/booklist" element={<BookList />} />
          <Route path="/book/:id" element={<BookInfo />} />

          {/* ✅ 리뷰 관련 */}
          <Route path="/review/book/:id" element={<TotalReview />} />

          {/* ✅ 내가 쓴 리뷰 목록 페이지 */}
          <Route path="/reviewlist" element={<ReviewList />} /> 

          <Route path="/review/write/:id" element={<WriteReview />} />

          {/* ✅ 대여 및 찜 목록 */}
          <Route path="/rental" element={<RentalList />} />
          <Route path="/wishlist" element={<WishList />} />
        </Route>

        {/* ✅ 관리자 전용 영역 */}
        <Route element={<ProtectedLayout />}>
          <Route path="/admin" element={<AdminLayoutGuard />}>
            <Route index element={<Dashboard />} />
            <Route path="books" element={<BookManager />} />
          </Route>
        </Route>

        {/* ✅ 기본 및 잘못된 경로 처리 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
