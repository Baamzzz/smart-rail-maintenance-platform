import "./AdminPanel.css";
import useAutoLogout from "../useAutoLogout";
import { useState } from "react";

import Sidebar from "../../Components/Sidebar/Sidebar";
import {
  UserCircle,
  Users,
  ClipboardList,
  ShieldCheck,
  UserPlus,
  Pencil,
  Trash2,
  Circle,
  Activity,
} from "lucide-react";


function UserRow({ name, role, status, lastSeen }) {
  const isOnline = status === "Online";

  return (
    <tr>
      <td>{name}</td>
      <td>{role}</td>
      <td>
        <span className={`admin-status ${isOnline ? "online" : "offline"}`}>
          <Circle size={10} fill="currentColor" />
          {status}
        </span>
      </td>
      <td>{lastSeen}</td>
      <td>
        <div className="admin-actions">
          <button><Pencil size={18} /></button>
          <button><Trash2 size={18} /></button>
        </div>
      </td>
    </tr>
  );
}

function AdminStatCard({ icon, title, value, className }) {
    return (
      <div className={`admin-stat-card ${className}`}>
        <div className="admin-stat-icon">{icon}</div>
  
        <div className="admin-stat-text">
          <p>{title}</p>
          <h2>{value}</h2>
        </div>
      </div>
    );
  }

export default function AdminPanel() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  useAutoLogout();
  const currentUser = localStorage.getItem("currentUser") || "Admin";


  return (
    <div className="admin-page">
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

      <main className="admin-content">
        <header className="admin-topbar">
          <button
  className="mobile-menu-btn"
  onClick={() => setMobileSidebarOpen(true)}
>
  ☰
</button>
          <div>
            <p className="admin-welcome">Admin Control</p>
            <h1>User Management Dashboard</h1>
          </div>

          <div className="admin-top-user">
            <span>{currentUser}</span>
            <UserCircle size={38} />
          </div>
        </header>

        <section className="admin-stats-grid">
          <AdminStatCard
            icon={<Users size={28} />}
            title="Total Users"
            value="4"
            className="blue"
          />

          <AdminStatCard
            icon={<ShieldCheck size={28} />}
            title="Online Users"
            value="2"
            className="green"
          />

          <AdminStatCard
            icon={<Activity size={28} />}
            title="Offline Users"
            value="2"
            className="red"
          />

          <AdminStatCard
            icon={<ClipboardList size={28} />}
            title="Admin Accounts"
            value="1"
            className="purple"
          />
        </section>

        <div className="admin-tabs">
  <button
    className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
    onClick={() => setActiveTab("users")}
  >
    User Management
  </button>

  <button
    className={`admin-tab ${activeTab === "logs" ? "active" : ""}`}
    onClick={() => setActiveTab("logs")}
  >
    Audit Logs
  </button>
</div>

{activeTab === "users" ? (
        <section className="admin-table-card">
          <div className="admin-table-header">
            <div>
              <h2>User Accounts</h2>
              <p>Manage engineers, control room operators and administrators</p>
            </div>

            <button className="create-user-button">
              <UserPlus size={20} />
              Create New User
            </button>
          </div>

          <table className="admin-user-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Seen</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <UserRow
                name="Michael.A"
                role="Engineer"
                status="Offline"
                lastSeen="01/05/2026 17:48"
              />

              <UserRow
                name="Jasmine.H"
                role="Control Op"
                status="Online"
                lastSeen="Now"
              />

              <UserRow
                name="Monica.W"
                role="Admin"
                status="Online"
                lastSeen="Now"
              />

              <UserRow
                name="Joe.R"
                role="Engineer"
                status="Offline"
                lastSeen="29/04/2026 09:21"
              />
            </tbody>
          </table>

          <button className="admin-view-all">→ View All</button>
        </section>
) : (
  <section className="admin-table-card">
    <div className="admin-table-header">
      <div>
        <h2>Audit Logs</h2>
        <p>Recent administrator activity and security events</p>
      </div>
    </div>

    <table className="admin-user-table">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Admin User</th>
          <th>Action</th>
          <th>Target</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>17 Jun 2025 - 09:14</td>
          <td>admin@techin.com</td>
          <td>User Created</td>
          <td>j.smith@techin.com</td>
          <td>
            <span className="admin-status online">Success</span>
          </td>
        </tr>

        <tr>
          <td>17 Jun 2025 - 10:02</td>
          <td>security@techin.com</td>
          <td>Password Reset</td>
          <td>m.williams@techin.com</td>
          <td>
            <span className="admin-status online">Success</span>
          </td>
        </tr>

        <tr>
          <td>17 Jun 2025 - 11:27</td>
          <td>admin@techin.com</td>
          <td>Account Disabled</td>
          <td>temp.user@techin.com</td>
          <td>
            <span className="admin-status offline">Completed</span>
          </td>
        </tr>

        <tr>
          <td>17 Jun 2025 - 12:11</td>
          <td>system@techin.com</td>
          <td>Failed Login Attempt</td>
          <td>unknown IP 192.168.1.44</td>
          <td>
            <span className="admin-status offline">Blocked</span>
          </td>
        </tr>

        <tr>
          <td>17 Jun 2025 - 13:46</td>
          <td>admin@techin.com</td>
          <td>Permissions Updated</td>
          <td>s.jones@techin.com</td>
          <td>
            <span className="admin-status online">Success</span>
          </td>
        </tr>

        <tr>
          <td>17 Jun 2025 - 14:33</td>
          <td>security@techin.com</td>
          <td>Audit Export Generated</td>
          <td>System Logs</td>
          <td>
            <span className="admin-status online">Success</span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
)}
      </main>
    </div>
  );
}