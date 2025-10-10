import "./Sidebar.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h3>Admin</h3>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/admin" className="menu-item">
          <span>Dashboard</span>
        </NavLink>

        <div className="menu-item disabled">
          <span>Catalog</span>
        </div>
        <div className="menu-item disabled">
          <span>Books</span>
        </div>
        <div className="menu-item disabled">
          <span>Users</span>
        </div>
        <div className="menu-item disabled">
          <span>Branches</span>
        </div>
      </nav>
    </aside>
  );
}
