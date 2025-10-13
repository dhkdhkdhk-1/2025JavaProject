import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/login/Login"; // 로그인 컴포넌트
import Home from "./pages/home/Home"; // 홈 컴포넌트 (새로 만드셨거나 기존에 있음)
import BookList from "./pages/booklist/BookList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/books" element={<BookList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
