import "./ARMarkers.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, ScanLine, Wrench, AlertTriangle } from "lucide-react";

function MarkerCard({ title, code, icon }) {
  return (
    <div className="marker-card">
      <div className="marker-qr">{code}</div>
      <div className="marker-info">{icon}<h2>{title}</h2><p>Print or show this marker to test the AR scanner.</p></div>
    </div>
  );
}

export default function ARMarkers() {
  const navigate = useNavigate();
  return (
    <div className="markers-page">
      <header className="markers-topbar">
        <button onClick={() => navigate("/ar")}><ArrowLeft size={22}/></button>
        <h1>AR Markers</h1>
        <button onClick={() => window.print()}><Printer size={22}/></button>
      </header>
      <main className="markers-grid">
        <MarkerCard title="Fault Detection Marker" code="FAULT-AR" icon={<AlertTriangle size={32}/>} />
        <MarkerCard title="Tool Tracking Marker" code="TOOL-AR" icon={<Wrench size={32}/>} />
        <MarkerCard title="General Scan Marker" code="SCAN-AR" icon={<ScanLine size={32}/>} />
      </main>
    </div>
  );
}
