// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/Layout";
import AdminLayout from "./layout/admin/AdminLayout";

// 사용자 페이지
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import BookList from "./pages/booklist/BookList";

// 관리자 페이지
import Dashboard from "./pages/admin/Dashboard";
import BookManager from "./pages/admin/BookManager";

/** 로그인 가드: 로그인되어 있으면 Layout을 렌더, 아니면 /login으로 */
const ProtectedLayout: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;
  // ✅ Layout 내부에 <Outlet />이 있어야 하며, 아래 중첩 라우트가 Outlet으로 들어갑니다.
  return <Layout />;
};

/** 관리자 가드: ADMIN만 AdminLayout 렌더, 아니면 /home으로 */
const AdminLayoutGuard: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/home" replace />;
  // ✅ AdminLayout 내부에 <Outlet />이 있어야 하고, 아래 중첩 라우트가 Outlet으로 들어갑니다.
  return <AdminLayout />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 비로그인 기본 진입: 로그인 페이지 */}
        <Route path="/login" element={<Login />} />

        {/* 로그인한 사용자 전용 영역 */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/booklist" element={<BookList />} />
        </Route>

        {/* 관리자 전용 영역 (로그인 + 롤 가드) */}
        <Route element={<AdminLayoutGuard />}>
          <Route path="/admin" element={<Dashboard />}>
            <Route path="books" element={<BookManager />} />
          </Route>
        </Route>

        {/* 기본 및 미지정 경로 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
