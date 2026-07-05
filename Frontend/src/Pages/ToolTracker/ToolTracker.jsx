import "./ToolTracker.css";
import useAutoLogout from "../useAutoLogout";
import { useState, useEffect } from "react";
import { apiRequest } from "../../api";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Hammer,
  Drill,
  ShieldCheck,
  Package,
  ClipboardList,
  ScanLine,
  Calendar,
  Timer,
  User,
  CheckCircle,
  XCircle,
  Ruler,
  MoreHorizontal,
  ArrowRight,
} from "lucide-react";


function ToolRow({ icon, name, status, lastSeen, location, condition }) {
  const isMissing = status === "Missing";

  return (
    <tr>
      <td>
        <div className="tool-name-cell">
          <div className={`tool-icon-box ${isMissing ? "missing" : "detected"}`}>
            {icon}
          </div>
          <div>
            <strong>{name}</strong>
            <span>{condition}</span>
          </div>
        </div>
      </td>

      <td>
        <span className={`tool-status ${isMissing ? "missing" : "detected"}`}>
          {isMissing ? <XCircle size={18} /> : <CheckCircle size={18} />}
          {status}
        </span>
      </td>

      <td>{lastSeen}</td>
      <td>{location}</td>
    </tr>
  );
}

function SummaryCard({ icon, title, value, className }) {
  return (
    <div className={`tool-summary-mini ${className}`}>
      <div className="summary-icon">{icon}</div>
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}

function ActionCard({ icon, title, text, className, onClick }) {
  return (
    <div className={`tool-action-card ${className}`}>
      <div className="action-icon">{icon}</div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>

      <button onClick={onClick}>
        <ArrowRight size={22} />
      </button>
    </div>
  );
}

function CategoryCard({ icon, title, count, className }) {
  return (
    <div className={`tool-category-card ${className}`}>
      {icon}
      <div>
        <h3>{title}</h3>
        <p>{count}</p>
      </div>
    </div>
  );
}

export default function ToolTracker() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [tools, setTools] = useState([]);
  useAutoLogout();
    const navigate = useNavigate();
    const currentUser = localStorage.getItem("currentUser") || "Not logged in";
    useEffect(() => {
      async function loadTools() {
        try {
          const data = await apiRequest("/tools");
          setTools(data);
        } catch (err) {
          console.error("Failed to load tools:", err.message);
        }
      }
    
      loadTools();
    }, []);
  return (
    <div className="tool-page">
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

      <main className="tool-content">
        <header className="tool-header">
          <button
  className="mobile-menu-btn"
  onClick={() => setMobileSidebarOpen(true)}
>
  ☰
</button>
          <div>
            <h1>Tool Tracker</h1>
            <p>Scan, track and manage maintenance tools</p>
          </div>

          <div className="tool-scan-card">
            <div className="scan-mini-icon">
              <ScanLine size={28} />
            </div>

            <div>
              <p>Last scan</p>
              <h3>Today, 13:17</h3>
            </div>

            <button type="button" onClick={() => navigate("/ar-scan?mode=tool")}>
              <ScanLine size={22} />
              Rescan Tools
            </button>
          </div>
        </header>

        <section className="tool-main-grid">
          <div className="tool-table-panel">
            <div className="tool-panel-title">
              <h2>Tool Scan (Nearby)</h2>
              <span>Live scan active</span>
            </div>

            <table className="tool-table">
              <thead>
                <tr>
                  <th>Tool Name</th>
                  <th>Status</th>
                  <th>Last Seen</th>
                  <th>Storage Location</th>
                </tr>
              </thead>

              <tbody>
  {tools.map((tool) => (
    <ToolRow
      key={tool.markerId}
      icon={<Wrench size={28} />}
      name={tool.name}
      condition={tool.status}
      status={tool.status === "Faulty" ? "Missing" : "Detected"}
      lastSeen={tool.lastChecked}
      location={tool.location}
    />
  ))}
</tbody>
            </table>
          </div>

          <aside className="tool-right-column">
            <div className="tool-summary-panel">
              <div className="tool-panel-title small">
                <h2>Tool Summary</h2>
                <ShieldCheck size={26} />
              </div>

              <div className="tool-summary-grid">
                <SummaryCard
                  icon={<CheckCircle size={26} />}
                  title="Detected"
                  value={tools.filter((tool) => tool.status !== "Faulty").length}
                  className="detected"
                />

                <SummaryCard
                  icon={<XCircle size={26} />}
                  title="Missing"
                  value={tools.filter((tool) => tool.status === "Faulty").length}
                  className="missing"
                />

                <SummaryCard
                  icon={<Wrench size={26} />}
                  title="Total Tools"
                  value={tools.length}
                  className="total"
                />
              </div>
            </div>

            <div className="tool-info-panel">
              <h2>Scan Information</h2>

              <div className="scan-info-row">
                <Calendar size={24} />
                <div>
                  <p>Last Scan</p>
                  <h3>Today, 13:17</h3>
                </div>
              </div>

              <div className="scan-info-row">
                <Timer size={24} />
                <div>
                  <p>Scan Location</p>
                  <h3>Victoria Station, Platform C</h3>
                </div>
              </div>

              <div className="scan-info-row">
                <User size={24} />
                <div>
                  <p>Scanned By</p>
                  <h3>{currentUser}</h3>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="tool-actions-panel">
          <h2>Quick Actions</h2>

          <div className="tool-actions-grid">
            <ActionCard
              icon={<ClipboardList size={34} />}
              title="Report a New Tool Fault"
              text="Report damaged, lost or malfunctioning tools"
              className="report"
              onClick={() => navigate("/report-tool")}
            />

            <ActionCard
              icon={<ClipboardList size={34} />}
              title="Tool Instruction List"
              text="View tool purpose and proper usage instructions"
              className="instructions"
              onClick={() => alert("Tool instructions: inspect the tool ID, confirm storage location, check condition, and report any damage before use.")}
            />

            <ActionCard
              icon={<Package size={34} />}
              title="Material Stock"
              text="Check bolts, screws, cables and stock availability"
              className="stock"
              onClick={() => navigate("/materials")}
            />
          </div>
        </section>

        <section className="tool-categories-panel">
          <h2>Tool Categories</h2>

          <div className="tool-categories-grid">
            <CategoryCard
              icon={<Hammer size={30} />}
              title="Hand Tools"
              count="12 Tools"
              className="blue-category"
            />

            <CategoryCard
              icon={<Drill size={30} />}
              title="Power Tools"
              count="8 Tools"
              className="purple-category"
            />

            <CategoryCard
              icon={<ShieldCheck size={30} />}
              title="Safety Gear"
              count="6 Tools"
              className="green-category"
            />

            <CategoryCard
              icon={<Ruler size={30} />}
              title="Measuring Tools"
              count="5 Tools"
              className="orange-category"
            />

            <CategoryCard
              icon={<MoreHorizontal size={30} />}
              title="Other Tools"
              count="3 Tools"
              className="gray-category"
            />
          </div>
        </section>
      </main>
    </div>
  );
}