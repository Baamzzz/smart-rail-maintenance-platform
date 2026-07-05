import "./MaterialStock.css";
import "../Dashboard/Dashboard.css";

import useAutoLogout from "../useAutoLogout";
import { useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import {
  Home,
  AlertCircle,
  Wrench,
  Map,
  Bell,
  Settings,
  TrainFront,
  UserCircle,
  LogOut,
  Users,
  Package,
  Boxes,
  TriangleAlert,
  ScanLine,
  Search,
} from "lucide-react";

export default function MaterialStock() {

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useAutoLogout();

  const navigate = useNavigate();

  const currentUser =
    localStorage.getItem("currentUser") || "Not logged in";

  const stockItems = [
    {
      name: "Track Bolts",
      quantity: 1240,
      status: "Good",
    },

    {
      name: "Signal Cables",
      quantity: 320,
      status: "Low",
    },

    {
      name: "Tunnel Fasteners",
      quantity: 89,
      status: "Critical",
    },

    {
      name: "Electrical Fuses",
      quantity: 514,
      status: "Good",
    },

    {
      name: "Rail Clips",
      quantity: 162,
      status: "Low",
    },

    {
      name: "Hydraulic Pipes",
      quantity: 42,
      status: "Critical",
    },
  ];

  return (
    <div className="page">

      {mobileSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside className={`sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}>

        <button
          className="close-sidebar-btn"
          onClick={() => setMobileSidebarOpen(false)}
        >
          ✕
        </button>

        <div className="logo-wrap">
          <TrainFront size={64} strokeWidth={2.5} />
        </div>

        <h2>RAILWAY<br />MAINTENANCE SYSTEM</h2>

        <nav className="menu">

          <NavLink to="/dashboard" className="menu-item">
            <Home size={22} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/faults" className="menu-item">
            <AlertCircle size={22} />
            <span>Fault Dashboard</span>
          </NavLink>

          <NavLink to="/tools" className="menu-item active">
            <Wrench size={22} />
            <span>Tool Tracker</span>
          </NavLink>

          <NavLink to="/railmap" className="menu-item">
            <Map size={22} />
            <span>Rail Map</span>
          </NavLink>

          <NavLink to="/ar" className="menu-item">
            <ScanLine size={22} />
            <span>AR Interface</span>
          </NavLink>

          <NavLink to="/notifications" className="menu-item notification-item">
            <Bell size={22} />
            <span>Notifications</span>
            <span className="notification-badge">3</span>
          </NavLink>

          <NavLink to="/settings" className="menu-item">
            <Settings size={22} />
            <span>Settings</span>
          </NavLink>

          {localStorage.getItem("role") === "admin" && (
  <NavLink to="/admin" className="admin-menu-item">
    <Users size={22} />
    <span>Admin Panel</span>
  </NavLink>
)}

        </nav>

        <div className="sidebar-user-card">

          <UserCircle size={38} />

          <div>
            <h3>{currentUser}</h3>
            <p><span></span> Online</p>
          </div>

          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem("currentUser");
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/");
              navigate("/");
            }}
          >
            <LogOut size={18} />
          </button>

        </div>

      </aside>

      {/* CONTENT */}

      <main className="materials-content">

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileSidebarOpen(true)}
        >
          ☰
        </button>

        <header className="materials-topbar">

          <div>
            <p className="materials-small-text">
              Tool & Equipment Management
            </p>

            <h1>Material Stock Inventory</h1>
          </div>

          <div className="materials-search">

            <Search size={20} />

            <input placeholder="Search material..." />

          </div>

        </header>

        {/* SUMMARY */}

        <section className="materials-summary-grid">

          <div className="materials-summary-card blue-card">
            <Boxes size={34} />
            <h2>2367</h2>
            <p>Total Materials</p>
          </div>

          <div className="materials-summary-card green-card">
            <Package size={34} />
            <h2>4</h2>
            <p>Fully Stocked</p>
          </div>

          <div className="materials-summary-card yellow-card">
            <TriangleAlert size={34} />
            <h2>2</h2>
            <p>Low Stock</p>
          </div>

        </section>

        {/* TABLE */}

        <section className="materials-panel">

          <div className="materials-panel-header">
            <h2>Current Inventory</h2>
          </div>

          <table className="materials-table">

            <thead>

              <tr>
                <th>Material</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {stockItems.map((item) => (

                <tr key={item.name}>

                  <td>{item.name}</td>

                  <td>{item.quantity}</td>

                  <td>
                    <span className={`stock-status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </section>

      </main>

    </div>
  );
}