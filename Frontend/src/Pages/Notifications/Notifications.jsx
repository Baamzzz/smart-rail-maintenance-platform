// Notifications.jsx
import useAutoLogout from "../useAutoLogout";
import "./Notifications.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  ShieldAlert,
  UserCircle,
} from "lucide-react";


export default function Notifications() {
  const currentUser =
  localStorage.getItem("currentUser") || "Not logged in";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  useAutoLogout();
  const notifications = [
    {
      type: "critical",
      title: "Critical Signal Failure",
      description:
        "Signal communication lost near London Bridge Platform 4.",
      time: "2 mins ago",
    },

    {
      type: "warning",
      title: "Missing Tool Detected",
      description:
        "Torque wrench T-204 missing from maintenance inventory.",
      time: "14 mins ago",
    },

    {
      type: "success",
      title: "Fault Successfully Resolved",
      description:
        "Brake inspection completed on Train NX-204 successfully.",
      time: "28 mins ago",
    },

    {
      type: "info",
      title: "Engineer Login",
      description:
        "Engineer Daniel Morris authenticated via secure device access.",
      time: "1 hour ago",
    },

    {
      type: "warning",
      title: "High Track Temperature",
      description:
        "Track temperature exceeded safe threshold near Waterloo.",
      time: "2 hours ago",
    },

    {
      type: "critical",
      title: "Unauthorised Access Attempt",
      description:
        "Blocked login attempt detected from unknown device.",
      time: "4 hours ago",
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "critical":
        return <ShieldAlert />;
      case "warning":
        return <AlertTriangle />;
      case "success":
        return <CheckCircle2 />;
      default:
        return <Info />;
    }
  };

  return (
    <div className="page">
      {mobileSidebarOpen && (
  <div
    className="sidebar-overlay"
    onClick={() => setMobileSidebarOpen(false)}
  />
)}
      {/* SIDEBAR */}

      <Sidebar
  mobileSidebarOpen={mobileSidebarOpen}
  setMobileSidebarOpen={setMobileSidebarOpen}
/>

      {/* MAIN CONTENT */}

      <main className="content">
        {/* TOPBAR */}

        <div className="topbar">
          <button
  className="mobile-menu-btn"
  onClick={() => setMobileSidebarOpen(true)}
>
  ☰
</button>
          <div>

            <h1>Notifications</h1>
          </div>

          <div className="admin-top-user">
            <span>{currentUser}</span>
            <UserCircle size={38} />
          </div>
        </div>

        {/* STATS */}

        <section className="notification-stats">
          <div className="notification-stat-card critical-card">
            <div className="notification-icon critical">
              <ShieldAlert />
            </div>

            <h2>2</h2>

            <p>Critical Alerts</p>
          </div>

          <div className="notification-stat-card warning-card">
            <div className="notification-icon warning">
              <AlertTriangle />
            </div>

            <h2>2</h2>

            <p>Warnings</p>
          </div>

          <div className="notification-stat-card success-card">
            <div className="notification-icon success">
              <CheckCircle2 />
            </div>

            <h2>1</h2>

            <p>Resolved</p>
          </div>

          <div className="notification-stat-card info-card">
            <div className="notification-icon info">
              <Info />
            </div>

            <h2>1</h2>

            <p>System Info</p>
          </div>
        </section>

        {/* NOTIFICATIONS */}

        <section className="notifications-section">
          <div className="notifications-header">
            <h2>Recent Notifications</h2>

            <button>Mark All as Read</button>
          </div>

          <div className="notifications-list">
            {notifications.map((item, index) => (
              <div className="notification-card" key={index}>
                <div className={`notification-type ${item.type}`}>
                  {getIcon(item.type)}
                </div>

                <div className="notification-content">
                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </div>

                <div className="notification-right">
                  <span>{item.time}</span>

                  <ChevronRight />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}