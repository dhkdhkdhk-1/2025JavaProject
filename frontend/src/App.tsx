import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
// import Home from "./pages/home/Home";
import Login from "./Login"; // Login 컴포넌트 import
import BookList from "./pages/booklist/BookList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} /> {/* Home 대신 Login */}
          <Route path="/books" element={<BookList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
