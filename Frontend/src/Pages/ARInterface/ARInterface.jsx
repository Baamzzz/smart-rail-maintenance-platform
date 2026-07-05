import "./ARInterface.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, faults } from "../../api";
import { ArrowLeft, MapPin, ScanLine, Wrench, AlertTriangle, HardHat, Mic, ExternalLink } from "lucide-react";

export default function ARInterface() {
  const navigate = useNavigate();
  const user = auth.getUser();
  const [faultList, setFaultList] = useState([]);

  useEffect(() => {
    faults.getAll().then(setFaultList).catch(() => setFaultList([]));
  }, []);

  const activeFaults = faultList.filter((f) => String(f.severity || "").toLowerCase() === "high" || String(f.severity || "").toLowerCase() === "medium");
  const topFault = activeFaults[0];

  return (
    <div className="ar-page">
      <header className="ar-topbar">
        <button className="ar-back-btn" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={24} />
        </button>
        <h1>AR Interface</h1>
        <div className="ar-train-icon">&#x1F686;</div>
      </header>

      <div className="ar-engineer-bar">
        <div className="ar-engineer-left">
          <div className="ar-avatar">&#x1F477;</div>
          <span>Account: {user?.name || "Unknown"}</span>
        </div>
        <div className="ar-role-badge">{user?.role || "engineer"}</div>
      </div>

      <div className="ar-launch-section">
        <h2>Launch AR Mode</h2>
        <p>Point your mobile camera at an AR marker to begin. HTTPS is required for camera access.</p>
        <div className="ar-launch-grid">
          <button type="button" className="ar-launch-card fault" onClick={() => navigate("/ar-scan?mode=fault")}>
            <AlertTriangle size={32} />
            <h3>Fault Detection AR</h3>
            <p>Scan markers to identify &amp; annotate infrastructure faults</p>
            <span className="ar-launch-badge">{activeFaults.length} Active Fault{activeFaults.length !== 1 ? "s" : ""}</span>
            <ExternalLink size={16} className="ar-ext-icon" />
          </button>
          <button type="button" className="ar-launch-card tools" onClick={() => navigate("/ar-scan?mode=tool")}>
            <Wrench size={32} />
            <h3>Tool Tracking AR</h3>
            <p>Scan tool markers for status, accountability &amp; usage steps</p>
            <span className="ar-launch-badge tools">Live Tracking</span>
            <ExternalLink size={16} className="ar-ext-icon" />
          </button>
        </div>
        <button type="button" className="ar-markers-link" onClick={() => navigate("/markers")}>
          &#x1F4C4; View &amp; Print AR Markers
        </button>
      </div>

      <main className="ar-camera-container">
        <img src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1600&auto=format&fit=crop" alt="Train AR preview" className="ar-camera-feed" />
        <div className="ar-dark-overlay"></div>

        <div className="ar-overlay-top">
          <div className="ar-info-card"><div className="ar-info-left"><ScanLine size={18} /><span>Mode: <strong>Inspect</strong></span></div></div>
          <div className="ar-info-card"><div className="ar-info-left"><MapPin size={18} /><span>Location: Depot 1 — Bay 3</span></div></div>
        </div>

        <div className="fault-marker"></div><div className="fault-line"></div>
        <div className="fault-box">
          <h3>FAULT DETECTED</h3>
          <p><strong>{topFault?.id || "F-001"}</strong></p>
          <p>{topFault?.subtype || topFault?.type || "Track Damage"}</p>
          <p>Severity: <span className="high-severity"> {(topFault?.severity || "high").toUpperCase()}</span></p>
          <p>2.4m away</p>
          <div className="repair-box"><h4>Repair Guidance</h4><ul>{(topFault?.repairInstructions || ["Isolate track section", "Measure gauge deviation", "Apply tamping to correct ballast"]).slice(0, 3).map((step, i) => <li key={i}>{step}</li>)}</ul></div>
        </div>

        <div className="tool-marker"></div><div className="tool-line"></div>
        <div className="tool-box"><h3>TOOL DETECTED</h3><p>Torque Wrench (T-001)</p><p>Storage: Cabinet A – Bay 3</p><p>Status: <span className="tool-ok"> Working</span></p><p>1.2m away</p></div>

        <div className="hazard-popup"><div className="hazard-top"><AlertTriangle size={18} /><span>Nearby Hazard</span></div><p>Live electrical rail detected nearby.</p></div>
        <div className="safety-gear-box"><div className="safety-title"><HardHat size={18} /><span>Safety Gear Check</span></div><div className="safety-items"><div className="gear ok">Helmet ✓</div><div className="gear ok">Vest ✓</div><div className="gear ok">Gloves ✓</div></div></div>
        <div className="voice-box"><Mic size={18} /><span>Voice: "Next Step"</span></div>
      </main>

      <footer className="ar-bottom-nav single-scan">
        <button className="ar-nav-btn active" onClick={() => navigate("/ar-scan")}><ScanLine size={28} /><span>Scan</span></button>
      </footer>
    </div>
  );
}
