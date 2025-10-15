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

// 관리자 페이지
import Dashboard from "./pages/admin/Dashboard";
import BookManager from "./pages/admin/BookManager";

/** 로그인 가드 */
const ProtectedLayout: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;
  return <Layout />;
};

/** 관리자 가드 */
const AdminLayoutGuard: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/home" replace />;
  return <AdminLayout />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 비로그인 접근 가능 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* 로그인 필요 영역 */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/booklist" element={<BookList />} />
        </Route>

        {/* 관리자 전용 영역 (로그인 + 롤 가드) */}
        <Route element={<AdminLayoutGuard />}>
          <Route path="/admin" element={<Dashboard />}>
        {/* 관리자 영역 */}
        <Route element={<ProtectedLayout />}>
          <Route path="/admin" element={<AdminLayoutGuard />}>
            <Route index element={<Dashboard />} />
            <Route path="books" element={<BookManager />} />
          </Route>
        </Route>
        {/* 기본 라우트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
