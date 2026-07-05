import "./Dashboard.css";
import useAutoLogout from "../useAutoLogout";
import { useState, useEffect } from "react";
import { apiRequest } from "../../api";
import Sidebar from "../../Components/Sidebar/Sidebar";
import {
  UserCircle,
  Users,
  ClipboardList,
  Zap,
  ShieldCheck,
} from "lucide-react";

import railMap from "../../assets/map.png";


function ActivityRow({ icon, iconClass, title, subtitle }) {
  return (
    <div className="activity-row">
      <div className={`activity-icon ${iconClass}`}>{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, colourClass, cardClass, icon }) {
  return (
    <div className={`stat-card ${cardClass}`}>
      <div className={`stat-icon ${cardClass}`}>{icon}</div>
      <p>{title}</p>
      <h2 className={colourClass}>{value}</h2>
      <button>→ View All</button>
    </div>
  );
}

export default function Dashboard() {

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [faults, setFaults] = useState([]);
  const [tasks, setTasks] = useState([]);
  useAutoLogout();

  const currentUser = localStorage.getItem("currentUser") || "Not logged in";
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const faultsData = await apiRequest("/faults");
        const tasksData = await apiRequest("/tasks");
  
        setFaults(faultsData);
        setTasks(tasksData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err.message);
      }
    }
  
    loadDashboardData();
  }, []);
  async function updateTaskStatus(id, status) {
    try {
      const updatedTask = await apiRequest(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
  
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    } catch (err) {
      console.error("Failed to update task:", err.message);
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
      <Sidebar
  mobileSidebarOpen={mobileSidebarOpen}
  setMobileSidebarOpen={setMobileSidebarOpen}
/>

      {/* MAIN CONTENT */}
      <main className="content">
        {/* TOP BAR */}
        <header className="topbar">

<button
  className="mobile-menu-btn"
  onClick={() => setMobileSidebarOpen(true)}
>
  ☰
</button>

<div>
            <h1>Dashboard</h1>
          </div>

          <div className="admin-top-user">
            <span>{currentUser}</span>
            <UserCircle size={38} />
          </div>
        </header>

        {/* UPPER SECTION */}
        <section className="upper-section">
          {/* ACTIVITY */}
          <div>
            <h2 className="section-heading">Latest Activity</h2>

            <div className="activity-box">
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
            </div>

            <button className="view-under">→ View All</button>
          </div>

          {/* MAP */}
          <div className="map-panel">
            <h2 className="section-heading">Rail Network Map</h2>

            <div className="rail-map">
              <img src={railMap} alt="Rail map" />
            </div>

            <button className="view-under map-view">→ View Full Map</button>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-section">
        <StatCard
  title="Engineers Online"
  value="3"
  colourClass="blue"
  cardClass="blue-card"
  icon={<Users size={28} />}
/>

<StatCard
  title="New Faults Today"
  value={faults.length}
  colourClass="red"
  cardClass="red-card"
  icon={<ClipboardList size={28} />}
/>

<StatCard
  title="Active Faults"
  value={faults.filter((fault) => fault.status === "Active").length}
  colourClass="yellow"
  cardClass="yellow-card"
  icon={<Zap size={28} />}
/>

<StatCard
  title="Resolved Faults Today"
  value={faults.filter((fault) => fault.status === "Resolved").length}
  colourClass="green"
  cardClass="green-card"
  icon={<ShieldCheck size={28} />}
/>
        </section>
        <section className="dashboard-card">
  <h2>Maintenance Tasks</h2>
  

  {tasks.map((task) => (
    <div key={task.id} className="task-row">

<div className="task-info">
    <h3>{task.title}</h3>

    <p>
        {task.assignee} • {task.priority} priority • Due {task.due}
    </p>
</div>

<div className="task-status">
    <select
        value={task.status}
        onChange={(e) =>
            updateTaskStatus(task.id, e.target.value)
        }
    >
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
    </select>
</div>

</div>
  ))}
</section>
      </main>
    </div>
  );
}