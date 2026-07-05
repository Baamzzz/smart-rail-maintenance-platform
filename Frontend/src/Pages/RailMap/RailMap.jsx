// RailMap.jsx

import "./RailMap.css";
import useAutoLogout from "../useAutoLogout";
import railMapImage from "../../assets/RailMap.png";
import { useState, useEffect } from "react";
import { apiRequest } from "../../api";
import Sidebar from "../../Components/Sidebar/Sidebar";

import {
  ShieldAlert,
  Train,
  Triangle,
  Activity,
  UserCircle,
} from "lucide-react";



export default function RailMap() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const currentUser =
  localStorage.getItem("currentUser") || "Not logged in";
  useAutoLogout();
  useEffect(() => {
    async function loadFaults() {
      try {
        const data = await apiRequest("/faults");
  
        const mappedAlerts = data.map((fault, index) => ({
          id: fault.id,
          title: fault.type,
          location: fault.location,
          severity: fault.severity,
          color:
            fault.severity === "High"
              ? "critical"
              : fault.severity === "Medium"
              ? "medium"
              : "safe",
          top: ["38%", "52%", "62%", "24%", "45%"][index] || "50%",
          left: ["68%", "45%", "28%", "18%", "55%"][index] || "50%",
        }));
  
        setAlerts(mappedAlerts);
      } catch (err) {
        console.error("Failed to load rail map faults:", err.message);
      }
    }
  
    loadFaults();
  }, []);


  return (
    <div className="page rail-page">
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
        <div className="topbar">
          <button
  className="mobile-menu-btn"
  onClick={() => setMobileSidebarOpen(true)}
>
  ☰
</button>
          <div>


            <h1>Rail Network Map</h1>
          </div>

          <div className="admin-top-user">
            <span>{currentUser}</span>
            <UserCircle size={38} />
          </div>
        </div>

        {/* SUMMARY */}

        <section className="rail-summary-grid">
          <div className="rail-summary-card">
            <div className="rail-summary-icon rail-red">
              <ShieldAlert />
            </div>

            <h2>{alerts.filter((alert) => alert.severity === "High").length}</h2>

            <p>Critical Alerts</p>
          </div>

          <div className="rail-summary-card">
            <div className="rail-summary-icon rail-yellow">
              <Triangle />
            </div>

            <h2>{alerts.filter((alert) => alert.severity === "Medium").length}</h2>

            <p>Track Warnings</p>
          </div>

          <div className="rail-summary-card">
            <div className="rail-summary-icon rail-green">
              <Train />
            </div>

            <h2>12</h2>

            <p>Active Trains</p>
          </div>

          <div className="rail-summary-card">
            <div className="rail-summary-icon rail-blue">
              <Activity />
            </div>

            <h2>98%</h2>

            <p>Rail Status</p>
          </div>
        </section>

        {/* MAP + ALERTS */}

        <section className="rail-layout">
          {/* MAP */}

          <div className="rail-map-panel">
            <div className="rail-map-header">
              <div>
                <h2>London Rail Network</h2>

                <p>Real-time operational overview</p>
              </div>

              <button>Live Monitoring</button>
            </div>

            <div className="rail-map-container">
              <img
                src={railMapImage}
                alt="Rail Map"
                className="rail-map-image"
              />

              {/* ALERT PINS */}

              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`map-alert-pin ${alert.color}`}
                  style={{
                    top: alert.top,
                    left: alert.left,
                  }}
                >
                  <div className="map-pulse"></div>

                  <div className="map-alert-popup">
                    <h3>{alert.title}</h3>

                    <p>{alert.location}</p>

                    <span>{alert.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE ALERTS */}

          <div className="rail-alerts-card">
            <div className="panel-title">
              <h2>Live Alerts</h2>

              <span>{alerts.length} Active</span>
            </div>

            <div className="rail-alert-item critical-border">
              <div className="alert-dot red-dot"></div>

              <div>
                <h3>Signal Failure</h3>

                <p>London Bridge Platform 4</p>
              </div>
            </div>

            <div className="rail-alert-item warning-border">
              <div className="alert-dot yellow-dot"></div>

              <div>
                <h3>Track Damage</h3>

                <p>Waterloo Underground Section</p>
              </div>
            </div>

            <div className="rail-alert-item medium-border">
              <div className="alert-dot orange-dot"></div>

              <div>
                <h3>Oil Leak Detected</h3>

                <p>Victoria Line Maintenance Area</p>
              </div>
            </div>

            <div className="rail-alert-item safe-border">
              <div className="alert-dot green-dot"></div>

              <div>
                <h3>Restricted Safety Zone</h3>

                <p>Paddington Rail Yard</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}