import "./Sidebar.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h3>Admin</h3>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/admin" end className="menu-item">
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/catalog" end className="menu-item">
          <span>Catalog</span>
        </NavLink>

        <NavLink to="/admin/books" className="menu-item">
          <span>Books</span>
        </NavLink>
        <NavLink to="/admin/users" className="menu-item">
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/branches" className="menu-item">
          <span>Branches</span>
        </NavLink>
        <NavLink to="/admin/answer" className="menu-item">
          <span>Cs Answer</span>
        </NavLink>
      </nav>
    </aside>
  );
}
