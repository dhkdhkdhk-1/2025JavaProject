import React, { useEffect } from "react";
import { setAccessToken } from "./api/AuthApi";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// ✅ Layouts
import Layout from "./layout/Layout";
import AdminLayout from "./layout/admin/AdminLayout";

// ✅ 사용자 페이지
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import BookList from "./pages/booklist/BookList";
import BookInfo from "./pages/bookinfo/BookInfo";
import TotalReview from "./pages/review/booktotalreview/BookTotalReview";
import RentalList from "./pages/rental/RentalList";
import WishList from "./pages/wishlist/WishList";
import ReviewList from "./pages/review/myreviewlist/MyReviewList";
import WriteReview from "./pages/review/writereview/WriteReview";
import ReviewDetail from "./pages/review/reviewdetail/ReviewDetail";
import CsListPage from "./pages/cspage/mycslist/MyCsListPage";
import MyCsListDetail from "./pages/cspage/mycslistdetail/MyCsListDetail";
import WriteCs from "./pages/cspage/writecs/WriteCs";
import Withdraw from "./pages/withdraw/Withdraw";
import AccountInfo from "./pages/accountinfo/AccountInfo";
import FindPassword from "./pages/findpassword/FindPassword";

// ✅ 관리자 페이지
import Dashboard from "./pages/admin/dashboard/Dashboard";
import BookManager from "./pages/admin/bookmanager/BookManager";
import MyPage from "./pages/mypage/MyPage";
import Catalog from "./pages/admin/catalog/Catalog";
import Users from "./pages/admin/user/Users";
import Branches from "./pages/admin/branches/Branches";

// ✅ 게시판 페이지
import BoardList from "./pages/board/BoardList";
import BoardRead from "./pages/board/BoardRead";
import BoardWrite from "./pages/board/BoardWrite";
import BoardEdit from "./pages/board/BoardEdit";
import Answer from "./pages/admin/answer/Answer";
import AnswerWrite from "./pages/admin/answerwrite/AnswerWrite";

/** ✅ 로그인 가드 */
const ProtectedLayout: React.FC = () => {
  const [isChecking, setIsChecking] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsAuthenticated(false);
      setIsChecking(false);
      return;
    }

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

/** ✅ 관리자 가드 */
const AdminLayoutGuard: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/home" replace />;
  return <AdminLayout />;
};

/** ✅ App */
const App: React.FC = () => {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 비로그인 가능 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/findpassword" element={<FindPassword />} />

        {/* 로그인 필요 */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          {/* ✅ 게시판 라우팅 */}
          <Route path="/board" element={<Outlet />}>
            <Route index element={<BoardList />} />
            <Route path=":id" element={<BoardRead />} />
            <Route path="write" element={<BoardWrite boardType="一般" />} />
            <Route
              path="notice/write"
              element={<BoardWrite boardType="告知" />}
            />
            <Route path="edit/:id" element={<BoardEdit />} />
          </Route>
          {/* ✅ 기타 페이지 */}
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/account-info" element={<AccountInfo />} />
          <Route path="/booklist" element={<BookList />} />
          <Route path="/book/:id" element={<BookInfo />} />
          {/* ✅ 리뷰 관련 */}
          <Route path="/review/book/:id" element={<TotalReview />} />{" "}
          {/* 내가 쓴 전체 리뷰들 보기 */}
          <Route path="/review/list" element={<ReviewList />} />{" "}
          {/* 그 책에 대한 전체리뷰) */}
          <Route path="/review/write/:id" element={<WriteReview />} />
          <Route path="/review/detail/:id" element={<ReviewDetail />} />
          {/* ✅ 대여 및 찜 목록 */}
          <Route path="/rental" element={<RentalList />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/booklist" element={<BookList />} />
          <Route path="/book/:id" element={<BookInfo />} />{" "}
          {/* 문의내역 보는 곳 */}
          <Route path="/mycslistpage" element={<CsListPage />} />{" "}
          {/* 내 전체 문의 내역 */}
          <Route path="/cs/detail/:id" element={<MyCsListDetail />} />{" "}
          {/* 문의 내역 상세 페이지 */}
          <Route path="/writecs" element={<WriteCs />} />{" "}
          {/* 문의작성 페이지 */}
          <Route path="/review/book/:id" element={<TotalReview />} />
          <Route path="/reviewlist" element={<ReviewList />} />
          <Route path="/review/write/:id" element={<WriteReview />} />
          <Route path="/rental" element={<RentalList />} />
          <Route path="/wishlist" element={<WishList />} />
        </Route>

        {/* ✅ 관리자 전용 */}
        <Route path="/admin" element={<AdminLayoutGuard />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<BookManager />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="users" element={<Users />} />
          <Route path="branches" element={<Branches />} />
          <Route path="answer" element={<Answer />} />
          <Route path="answerwrite/:id" element={<AnswerWrite />} />
        </Route>

        {/* 기본 라우팅 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
