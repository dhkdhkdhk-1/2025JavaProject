import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";
import BookList from "./pages/booklist/BookList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
