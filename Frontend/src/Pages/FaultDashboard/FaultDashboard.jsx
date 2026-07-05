import "./FaultDashboard.css";
import useAutoLogout from "../useAutoLogout";
import { faults as faultsApi } from "../../api";
import { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import {
  UserCircle,
  Users,
  ClipboardList,
  Zap,
  ShieldCheck,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const currentUser = localStorage.getItem("currentUser");

function StatCard({ title, value, colourClass, cardClass, icon }) {
  return (
    <div className={`fault-stat-card ${cardClass}`}>
      <div className={`fault-stat-icon ${cardClass}`}>{icon}</div>
      <p>{title}</p>
      <h2 className={colourClass}>{value}</h2>
      <button>→ View All</button>
    </div>
  );
}

function ActivityRow({ icon, iconClass, title, subtitle }) {
  return (
    <div className="fault-activity-row">
      <div className={`fault-activity-icon ${iconClass}`}>{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function CriticalRow({ title, subtitle }) {
  return (
    <div className="critical-row">
      <span className="table-dot"></span>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

export default function FaultDashboard() {

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [faults, setFaults] = useState([]);
  useAutoLogout();

  const navigate = useNavigate();
  useEffect(() => {
    async function loadFaults() {
      try {
        const data = await faultsApi.getAll();
        const stored = JSON.parse(localStorage.getItem("logged_faults") || "[]");
        const merged = [...stored, ...data];
        const seen = new Set();
        setFaults(merged.filter((fault) => {
          const key = String(fault.id || fault.markerId || `${fault.type}-${fault.location}-${fault.reported}`);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }));
      } catch {
        const stored = JSON.parse(localStorage.getItem("logged_faults") || "[]");
        setFaults(stored);
      }
    }
  
    loadFaults();
  }, []);
  return (
    <div className="fault-page">
      {mobileSidebarOpen && (
  <div
    className="sidebar-overlay"
    onClick={() => setMobileSidebarOpen(false)}
  />
)}
  <Sidebar
  mobileSidebarOpen={mobileSidebarOpen}
  setMobileSidebarOpen={setMobileSidebarOpen}
/>

      <main className="fault-content">
        <header className="fault-topbar">
          <button
  className="mobile-menu-btn"
  onClick={() => setMobileSidebarOpen(true)}
>
  ☰
</button>
          <div className="fault-top-left">

  <h1>Fault Dashboard <span>⚠️</span></h1>

  <button
  className="report-fault-btn"
  onClick={() => navigate("/report-fault")}
>
  Report a New Fault
</button>

</div>

<div className="admin-top-user">
            <span>{currentUser}</span>
            <UserCircle size={38} />
          </div>
        </header>

        <section className="fault-stats-section">
          <StatCard
            title="Engineers Online"
            value="3"
            colourClass="blue"
            cardClass="blue-card"
            icon={<Users size={28} />}
          />

          <StatCard
            title="New Faults Today"
            value="15"
            colourClass="red"
            cardClass="red-card"
            icon={<ClipboardList size={28} />}
          />

          <StatCard
            title="Active Faults"
            value={faults.filter(fault => String(fault.status).toLowerCase() === "active").length}
            colourClass="yellow"
            cardClass="yellow-card"
            icon={<Zap size={28} />}
          />

          <StatCard
            title="Resolved Faults Today"
            value={faults.filter(fault => String(fault.status).toLowerCase() === "resolved").length}
            colourClass="green"
            cardClass="green-card"
            icon={<ShieldCheck size={28} />}
          />
        </section>

        <section className="fault-main-grid">
          <div className="fault-panel">
            <h2>Latest Fault Activity</h2>

            <ActivityRow
              icon="✓"
              iconClass="success"
              title="Engineer signed out"
              subtitle="Michael.A • 14:47"
            />

            <ActivityRow
              icon="✓"
              iconClass="success"
              title="Fault Resolved"
              subtitle="Waterloo Station • 14:13"
            />

            <ActivityRow
              icon="!"
              iconClass="warning"
              title="New Fault Report"
              subtitle="Victoria Station, Platform C"
            />

            <ActivityRow
              icon="⚒"
              iconClass="danger"
              title="Tool Fault Report"
              subtitle="Missing Equipment Depot 12"
            />

            <button className="fault-view-button blue-link">→ View All</button>
          </div>

          <div className="fault-panel critical-panel">
            <h2>Latest Critical Fault Activity</h2>

            <div className="critical-list">
              <CriticalRow
                title="Train Engine Failure"
                subtitle="Victoria Station, Platform C"
              />

              <CriticalRow
                title="Electricity Outage"
                subtitle="Waterloo Station"
              />

              <CriticalRow
                title="Train Oil Leak"
                subtitle="Westminster Station, Platform D"
              />

              <CriticalRow
                title="Train Brake Issue"
                subtitle="Epsom Station, Platform A"
              />

              <button className="fault-view-button red-link">→ View All</button>
            </div>
          </div>

          <div className="severity-column">
            <div className="severity-card low">
              <div>
                <p>Low Severity Faults</p>
                <h2>{faults.filter((fault) => String(fault.severity).toLowerCase() === "low").length}</h2>
                <button>→ View All</button>
              </div>
              <div className="severity-icon green-bg">
                <ShieldCheck size={44} />
              </div>
            </div>

            <div className="severity-card medium">
              <div>
                <p>Medium Severity Faults</p>
                <h2>{faults.filter((fault) => String(fault.severity).toLowerCase() === "medium").length}</h2>
                <button>→ View All</button>
              </div>
              <div className="severity-icon yellow-bg">
                <Shield size={44} />
              </div>
            </div>
          </div>
        </section>

        <section className="critical-table-card">
          <div className="critical-table-header">
            <div className="critical-title-wrap">
              <div className="critical-alert-icon">
                <AlertTriangle size={30} />
              </div>
              <h2>Active <span>CRITICAL</span> Faults</h2>
            </div>

            <div className="critical-summary">
            {faults.filter((fault) => String(fault.severity).toLowerCase() === "high").length}
              <span>Total Active Critical Faults</span>
              <button>→ View All</button>
            </div>
          </div>

          <table className="critical-table">
            <thead>
              <tr>
                <th>Fault</th>
                <th>Location</th>
                <th>Platform</th>
                <th>Reported By</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
  {faults
    .filter((fault) => String(fault.status).toLowerCase() === "active")
    .map((fault) => (
      <tr key={fault.id}>
        <td>
          <CriticalRow title={fault.type} subtitle={fault.markerId} />
        </td>
        <td>{fault.location}</td>
        <td>-</td>
        <td>System</td>
        <td>{new Date(fault.reported).toLocaleTimeString()}</td>
        <td>{fault.status}</td>
        <td>
          <button>View</button>
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