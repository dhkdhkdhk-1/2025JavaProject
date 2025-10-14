import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Layout from "./layout/Layout";
import AdminLayout from "./layout/admin/AdminLayout";

// ✅ 사용자 페이지
import Home from "./pages/home/Home";
import BookList from "./pages/booklist/BookList";
import Login from "./pages/login/Login"; // ✅ 로그인 추가

// ✅ 관리자 페이지
import Dashboard from "./pages/admin/Dashboard";
import BookManager from "./pages/admin/BookManager";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 일반 사용자용 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/booklist" element={<BookList />} />
          <Route path="/login" element={<Login />} />{" "}
          {/* ✅ 로그인 경로 추가 */}
        </Route>

        {/* ✅ 관리자용 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />{" "}
          {/* 기본 /admin → Dashboard */}
          <Route path="books" element={<BookManager />} />{" "}
          {/* /admin/books → 도서관리 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
