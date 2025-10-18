// src/App.tsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Layout from "./layout/Layout";
import AdminLayout from "./layout/admin/AdminLayout";

// 사용자 페이지
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import BookList from "./pages/booklist/BookList";
import BookInfo from "./pages/bookinfo/BookInfo"; // ✅ 도서 상세 페이지 추가

// ✅ 게시판 페이지
import BoardList from "./pages/board/BoardList";
import BoardRead from "./pages/board/BoardRead";
import BoardWrite from "./pages/board/BoardWrite";
import BoardEdit from "./pages/board/BoardEdit";

// 관리자 페이지
import Dashboard from "./pages/admin/Dashboard";
import BookManager from "./pages/admin/BookManager";

/** ✅ 로그인 가드 (일반 사용자용) */
const ProtectedLayout: React.FC = () => {
  // ✅ 수정된 부분: 인증 상태를 안전하게 확인
  const [isChecking, setIsChecking] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsAuthenticated(false);
      setIsChecking(false);
      return;
    }

    // ✅ 토큰이 있으면 실제로 유효한지 서버에서 검증
    import("./api/AuthApi").then(({ getMe }) =>
      getMe()
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false))
        .finally(() => setIsChecking(false))
    );
  }, []);

  if (isChecking) return <div>🔄 인증 확인 중...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
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
          <Route path="/book/:id" element={<BookInfo />} /> {/* 도서 상세 */}
          {/* ✅ 게시판 영역 */}
          <Route path="/board" element={<Outlet />}>
            <Route index element={<BoardList />} /> {/* 목록 */}
            <Route path=":id" element={<BoardRead />} /> {/* 상세 */}
            <Route path="write" element={<BoardWrite />} /> {/* 작성 */}
            <Route path="edit/:id" element={<BoardEdit />} /> {/* 수정 */}
          </Route>
        </Route>

        {/* ✅ 관리자 전용 영역 */}
        <Route element={<ProtectedLayout />}>
          <Route path="/admin" element={<AdminLayoutGuard />}>
            <Route index element={<Dashboard />} /> {/* /admin */}
            <Route path="books" element={<BookManager />} />{" "}
            {/* /admin/books */}
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
