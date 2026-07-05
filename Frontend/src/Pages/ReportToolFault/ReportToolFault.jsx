import "./ReportToolFault.css";
import "../Dashboard/Dashboard.css";

import useAutoLogout from "../useAutoLogout";
import { useState } from "react";
import { apiRequest } from "../../api";
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
  ScanLine,
  ArrowLeft,
  Camera,
  MapPin,
} from "lucide-react";

export default function ReportToolFault() {

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [severity, setSeverity] = useState("Medium");
  const [toolName, setToolName] = useState("");
  const [location, setLocation] = useState("");
  useAutoLogout();

  const navigate = useNavigate();

  const currentUser =
    localStorage.getItem("currentUser") || "Not logged in";
    async function submitToolFault() {
      try {
        await apiRequest("/tools/report", {
          method: "POST",
          body: JSON.stringify({
            name: toolName,
            location: location,
            severity: severity,
          }),
        });
    
        navigate("/tools");
    
      } catch (err) {
        console.error("Failed to submit tool fault:", err.message);
      }
    }
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

          <NavLink
            to="/notifications"
            className="menu-item notification-item"
          >
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

      <main className="report-new-content">

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileSidebarOpen(true)}
        >
          ☰
        </button>

        <div className="report-container">

          {/* TOP */}

          <div className="report-top">

            <button
              className="back-btn"
              onClick={() => navigate("/tools")}
            >
              <ArrowLeft size={22} />
            </button>

            <h1>Report Tool Fault</h1>

          </div>

          {/* ICON */}

          <div className="report-train-icon">
            <Wrench size={70} strokeWidth={1.8} />
          </div>

          {/* FORM */}

          <div className="report-form">

            {/* TOOL NAME */}

            <div className="report-group">

              <label>Tool Name</label>

              <input
                className="tool-input"
                placeholder="Enter tool name..."
                value={toolName}
onChange={(e) => setToolName(e.target.value)}
              />

            </div>

            {/* TOOL ID */}

            <div className="report-group">

              <label>Tool ID</label>

              <input
                className="tool-input"
                placeholder="e.g. TOOL-204"
              />

            </div>

            {/* FAULT TYPE */}

            <div className="report-group">

              <label>Fault Type</label>

              <select>
                <option>Damaged</option>
                <option>Missing</option>
                <option>Unsafe</option>
                <option>Calibration Failure</option>
              </select>

            </div>

            {/* SEVERITY */}

            <div className="report-group">

              <label>Severity Level</label>

              <div className="severity-buttons">

                <button
                  className={severity === "Low" ? "active low" : ""}
                  onClick={() => setSeverity("Low")}
                >
                  Low
                </button>

                <button
                  className={severity === "Medium" ? "active medium" : ""}
                  onClick={() => setSeverity("Medium")}
                >
                  Medium
                </button>

                <button
                  className={severity === "High" ? "active high" : ""}
                  onClick={() => setSeverity("High")}
                >
                  High
                </button>

              </div>

            </div>

            {/* LOCATION */}

            <div className="report-group">

              <label>Location</label>

              <div className="location-box">

                <MapPin size={16} />

                <input placeholder="Station / tunnel / depot..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                />

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="report-group">

              <label>Fault Description</label>

              <textarea
                rows="5"
                placeholder="Describe the issue in detail..."
              />

            </div>

            {/* ATTACHMENTS */}

            <div className="report-group">

              <label>Attachments</label>

              <button className="attach-btn">

                <Camera size={18} />

                Attach Photo / Video

              </button>

            </div>

            {/* SUBMIT */}

            <button
  className="submit-btn"
  onClick={submitToolFault}
>

</button>

          </div>

        </div>

      </main>

    </div>
  );
}