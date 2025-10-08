import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import AdminLayout from "./layout/admin/AdminLayout";
import Home from "./pages/home/Home";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 일반 사용자용 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* 관리자용 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
