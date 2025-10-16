// src/layout/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

/**
 * ✅ 공통 사용자 레이아웃
 * - 모든 로그인된 사용자가 공유하는 UI 영역
 * - Header, Footer, 그리고 Outlet(중첩 라우트 페이지)을 포함
 */
const Layout: React.FC = () => {
  return (
    <>
      {/* 상단 공용 헤더 */}
      <Header />

      {/* 메인 컨텐츠 영역 (Outlet으로 하위 페이지 렌더링) */}
      <main style={{ minHeight: "calc(100vh - 260px)" }}>
        <Outlet />
      </main>

      {/* 하단 공용 푸터 */}
      <Footer />
    </>
  );
};

export default Layout;
