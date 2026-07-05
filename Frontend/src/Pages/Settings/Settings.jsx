// Settings.jsx

import "./Settings.css";
import useAutoLogout from "../useAutoLogout";
import { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";

import {
  Moon,
  Shield,
  Lock,
  Smartphone,
  Database,
  UserCircle,
} from "lucide-react";


export default function Settings() {
  const currentUser =
  localStorage.getItem("currentUser") || "Not logged in";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  useAutoLogout();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

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

      {/* MAIN */}

      <main className="content">
        {/* TOPBAR */}

        <div className="topbar">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open menu"
            type="button"
          >
            ☰
          </button>

          <div>

            <h1>Settings</h1>
          </div>

          <div className="admin-top-user">
            <span>{currentUser}</span>
            <UserCircle size={38} />
          </div>
        </div>

        {/* SETTINGS GRID */}

        <section className="settings-grid">
          {/* APPEARANCE */}

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon blue-bg">
                <Moon />
              </div>

              <div>
                <h2>Appearance</h2>
                <p>Visual preferences and display settings</p>
              </div>
            </div>

            <div className="setting-row">
              <div>
                <h3>Dark Mode</h3>
                <p>Enable dark theme for low-light tunnel environments</p>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />

                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-row">
              <div>
                <h3>Compact Dashboard</h3>
                <p>Reduce spacing for denser information display</p>
              </div>

              <label className="switch">
                <input type="checkbox" />

                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* SECURITY */}

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon red-bg">
                <Shield />
              </div>

              <div>
                <h2>Security</h2>
                <p>Authentication and access control settings</p>
              </div>
            </div>

            <div className="setting-row">
               <div>
              <h3>Multi-Layer Security Protection</h3>
              <p>Advanced authentication and railway system protection enabled</p>
            </div>

             <div className="encrypted-badge">
              <Lock size={16} />
                Active
              </div>
           </div>

            <div className="setting-row">
              <div>
                <h3>Encrypted User Sessions</h3>
                <p>Protect active engineer and admin sessions</p>
              </div>

              <div className="encrypted-badge">
                <Lock size={16} />
                Active
              </div>
            </div>
          </div>

          {/* DEVICES */}

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon yellow-bg">
                <Smartphone />
              </div>

              <div>
                <h2>Connected Devices</h2>
                <p>Manage approved AR maintenance devices</p>
              </div>
            </div>

            <div className="device-row">
              <div>
                <h3>AR Tablet - Engineer A</h3>
                <p>Last active: 2 mins ago</p>
              </div>

              <button>Disconnect</button>
            </div>

            <div className="device-row">
              <div>
                <h3>Inspection Mobile Device</h3>
                <p>Last active: 14 mins ago</p>
              </div>

              <button>Disconnect</button>
            </div>
          </div>

          {/* DATA */}

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon green-bg">
                <Database />
              </div>

              <div>
                <h2>Data & Backups</h2>
                <p>Maintenance logs and backup management</p>
              </div>
            </div>

            <div className="backup-box">
              <h3>Last Secure Backup</h3>

              <p>Today - 13:42 UTC</p>

              <button>Create Backup</button>
            </div>

            <div className="backup-box secondary">
              <h3>Encrypted Storage</h3>

              <p>All maintenance logs securely encrypted</p>

              <div className="encrypted-badge">
                <Lock size={16} />
                Active
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}