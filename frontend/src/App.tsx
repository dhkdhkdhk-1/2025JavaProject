// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/Layout";
import AdminLayout from "./layout/admin/AdminLayout";

// 사용자 페이지
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import BookList from "./pages/booklist/BookList";
import BookInfo from "./pages/bookinfo/BookInfo"; // ✅ 도서 상세 페이지 추가

// 관리자 페이지
import Dashboard from "./pages/admin/Dashboard";
import BookManager from "./pages/admin/BookManager";

/** ✅ 로그인 가드 (일반 사용자용) */
const ProtectedLayout: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;
  // ✅ 로그인 시 Layout 렌더링
  return <Layout />;
};

/** ✅ 관리자 가드 (ADMIN만 접근 허용) */
const AdminLayoutGuard: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/home" replace />;
  // ✅ 관리자 전용 Layout 렌더링
  return <AdminLayout />;
};

/** ✅ App */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 비로그인 접근 가능 영역 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ 로그인된 사용자 영역 (Layout + Outlet 구조) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/booklist" element={<BookList />} />
          <Route path="/book/:id" element={<BookInfo />} /> {/* ✅ 도서 상세 페이지 */}
        </Route>

        {/* ✅ 관리자 전용 영역 (Protected → AdminLayout 중첩 구조) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/admin" element={<AdminLayoutGuard />}>
            <Route index element={<Dashboard />} /> {/* /admin */}
            <Route path="books" element={<BookManager />} /> {/* /admin/books */}
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
