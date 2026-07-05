import "./TrainFaultReport.css";

import useAutoLogout from "../useAutoLogout";
import { useRef, useState } from "react";
import { faults as faultsApi } from "../../api";
import { NavLink, useNavigate } from "react-router-dom";

import { Home, AlertCircle, Wrench, Map, Bell, Settings, TrainFront, UserCircle, LogOut, Users, ScanLine, ArrowLeft, Camera, MapPin } from "lucide-react";

export default function TrainFaultReport() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [severity, setSeverity] = useState("Medium");
  const [faultType, setFaultType] = useState("Signal Failure");
  const [location, setLocation] = useState("");
  const [platform, setPlatform] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  useAutoLogout();

  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser") || "Not logged in";

  async function submitFault() {
    setMessage("");

    if (!faultType || !location || !description) {
      setMessage("Please fill in the fault type, location and explanation.");
      return;
    }

    setIsSubmitting(true);

    const newFault = {
      id: `F-${Date.now()}`,
      markerId: `M${Date.now().toString().slice(-4)}`,
      type: faultType,
      subtype: faultType,
      location: platform ? `${location}, ${platform}` : location,
      platform: platform || "-",
      severity: severity.toLowerCase(),
      status: "Active",
      reported: new Date().toISOString(),
      reportedDate: new Date().toISOString(),
      reportedBy: currentUser,
      description,
      attachmentName,
      repairInstructions: ["Inspect the reported area", "Isolate the affected section if required", "Update the fault once repaired"],
    };

    try {
      const savedFault = await faultsApi.logNew(newFault);
      const existing = JSON.parse(localStorage.getItem("logged_faults") || "[]");
      const idToCheck = String(savedFault?.id || newFault.id);
      if (!existing.some((fault) => String(fault.id) === idToCheck)) {
        localStorage.setItem("logged_faults", JSON.stringify([savedFault || newFault, ...existing]));
      }
      navigate("/faults");
    } catch {
      const existing = JSON.parse(localStorage.getItem("logged_faults") || "[]");
      localStorage.setItem("logged_faults", JSON.stringify([newFault, ...existing]));
      navigate("/faults");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page report-full-page">
      {mobileSidebarOpen && <div className="sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />}

      <aside className={`sidebar ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <button className="close-sidebar-btn" onClick={() => setMobileSidebarOpen(false)}>✕</button>
        <div className="logo-wrap"><TrainFront size={64} strokeWidth={2.5} /></div>
        <h2>RAILWAY<br />MAINTENANCE SYSTEM</h2>

        <nav className="menu">
          <NavLink to="/dashboard" className="menu-item"><Home size={22} /><span>Dashboard</span></NavLink>
          <NavLink to="/faults" className="menu-item active"><AlertCircle size={22} /><span>Fault Dashboard</span></NavLink>
          <NavLink to="/tools" className="menu-item"><Wrench size={22} /><span>Tool Tracker</span></NavLink>
          <NavLink to="/railmap" className="menu-item"><Map size={22} /><span>Rail Map</span></NavLink>
          <NavLink to="/ar" className="menu-item"><ScanLine size={22} /><span>AR Interface</span></NavLink>
          <NavLink to="/notifications" className="menu-item notification-item"><Bell size={22} /><span>Notifications</span><span className="notification-badge">3</span></NavLink>
          <NavLink to="/settings" className="menu-item"><Settings size={22} /><span>Settings</span></NavLink>
          {localStorage.getItem("role") === "admin" && <NavLink to="/admin" className="menu-item"><Users size={22} /><span>Admin Panel</span></NavLink>}
        </nav>

        <div className="sidebar-user-card">
          <UserCircle size={38} />
          <div><h3>{currentUser}</h3><p><span></span> Online</p></div>
          <button className="logout-button" onClick={() => { localStorage.clear(); navigate("/"); }} title="Logout"><LogOut size={18} /></button>
        </div>
      </aside>

      <main className="report-new-content">
        <div className="report-container">
          <div className="report-top">
            <button className="back-btn" onClick={() => navigate("/faults")}><ArrowLeft size={24} /></button>
            <h1>Report a New Fault</h1>
          </div>

          <div className="report-train-icon"><TrainFront size={100} strokeWidth={1.8} /></div>

          <div className="report-form">
            <div className="report-group">
              <label>Type of Fault</label>
              <select value={faultType} onChange={(event) => setFaultType(event.target.value)}>
                <option>Signal Failure</option><option>Track Damage</option><option>Electricity Outage</option><option>Brake System</option><option>Tunnel Hazard</option><option>Door Failure</option><option>Tool Fault</option><option>Other</option>
              </select>
            </div>

            <div className="report-group">
              <label>Fault Severity</label>
              <div className="severity-buttons">
                <button type="button" className={severity === "Low" ? "active low" : ""} onClick={() => setSeverity("Low")}>Low</button>
                <button type="button" className={severity === "Medium" ? "active medium" : ""} onClick={() => setSeverity("Medium")}>Medium</button>
                <button type="button" className={severity === "High" ? "active high" : ""} onClick={() => setSeverity("High")}>High</button>
              </div>
            </div>

            <div className="report-group"><label>Location</label><div className="location-box"><MapPin size={18} /><input placeholder="Waterloo Station" value={location} onChange={(event) => setLocation(event.target.value)} /></div></div>
            <div className="report-group"><label>Platform / Track</label><div className="location-box"><MapPin size={18} /><input placeholder="Platform 4 Track" value={platform} onChange={(event) => setPlatform(event.target.value)} /></div></div>
            <div className="report-group"><label>Explanation of Fault</label><textarea rows="7" placeholder="Describe what happened, what you can see, and any safety concerns..." value={description} onChange={(event) => setDescription(event.target.value)} /></div>

            <div className="report-group">
              <label>Attachments</label>
              <input ref={fileInputRef} className="hidden-file-input" type="file" accept="image/*,video/*" onChange={(event) => setAttachmentName(event.target.files?.[0]?.name || "")} />
              <button type="button" className="attach-btn" onClick={() => fileInputRef.current?.click()}><Camera size={22} />{attachmentName || "Attach a photo/video"}</button>
            </div>

            {message && <p className="report-message">{message}</p>}
            <button type="button" className="submit-btn" onClick={submitFault} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Fault"}</button>
          </div>
        </div>
      </main>
    </div>
  );
}
