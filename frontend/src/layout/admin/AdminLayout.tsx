import Sidebar from "../../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css";

console.log("🧩 Sidebar:", Sidebar); // ✅ 추가

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
