import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  AlertTriangle,
  Wrench,
  Map,
  Bell,
  Settings,
  TrainFront,
  UserCircle,
  LogOut,
  ScanLine,
  Users,
} from "lucide-react";

import "./Sidebar.css";

export default function Sidebar({ mobileSidebarOpen, setMobileSidebarOpen }) {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser") || "Not logged in";

  function handleLogout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  return (
    <>
      {mobileSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <button
          className="close-sidebar-btn"
          onClick={() => setMobileSidebarOpen(false)}
        >
          ✕
        </button>

        <div className="app-logo-wrap">
          <TrainFront size={64} strokeWidth={2.5} />
        </div>

        <h2>RAILWAY<br />MAINTENANCE SYSTEM</h2>

        <nav className="app-menu">
          <NavLink to="/dashboard" className="app-menu-item">
            <Home size={22} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/faults" className="app-menu-item">
            <AlertTriangle size={22} />
            <span>Fault Dashboard</span>
          </NavLink>

          <NavLink to="/tools" className="app-menu-item">
            <Wrench size={22} />
            <span>Tool Tracker</span>
          </NavLink>

          <NavLink to="/railmap" className="app-menu-item">
            <Map size={22} />
            <span>Rail Map</span>
          </NavLink>

          <NavLink to="/ar" className="app-menu-item">
            <ScanLine size={22} />
            <span>AR Interface</span>
          </NavLink>

          <NavLink to="/notifications" className="app-menu-item notification-item">
            <Bell size={22} />
            <span>Notifications</span>
            <span className="app-notification-badge">3</span>
          </NavLink>

          <NavLink to="/settings" className="app-menu-item">
            <Settings size={22} />
            <span>Settings</span>
          </NavLink>

          {localStorage.getItem("role") === "admin" && (
            <NavLink to="/admin" className="app-menu-item">
              <Users size={22} />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </nav>

        <div className="app-user-card">
          <UserCircle size={38} />
          <div>
            <h3>{currentUser}</h3>
            <p><span></span> Online</p>
          </div>

          <button
            className="app-logout-button"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
}