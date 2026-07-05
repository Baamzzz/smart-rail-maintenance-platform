import "./ARScan.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Camera, ScanLine, Wrench, AlertTriangle, CheckCircle, RotateCcw } from "lucide-react";

export default function ARScan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState("");
  const [scanned, setScanned] = useState(false);
  const mode = searchParams.get("mode") || "scan";
  const isToolMode = mode === "tool";
  const isFaultMode = mode === "fault";

  useEffect(() => {
    let mounted = true;

    async function openCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access is not supported in this browser.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (!mounted) return;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        if (!mounted) return;
        setCameraError(
          "Camera preview unavailable. On phones, camera access needs HTTPS or localhost, so this demo scan view is shown instead."
        );
      }
    }

    openCamera();

    const timer = setTimeout(() => setScanned(true), 1400);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const title = isToolMode ? "Tool Tracking AR" : isFaultMode ? "Fault Detection AR" : "AR Scanner";
  const resultTitle = isToolMode ? "Tool Detected" : isFaultMode ? "Fault Detected" : "Marker Detected";

  return (
    <div className="scan-page">
      <header className="scan-topbar">
        <button type="button" className="scan-back" onClick={() => navigate(isToolMode ? "/tools" : isFaultMode ? "/faults" : "/ar")}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1>{title}</h1>
          <p>Point your camera at a railway AR marker</p>
        </div>
      </header>

      <main className="scan-camera">
        <video ref={videoRef} className="scan-video" autoPlay playsInline muted />
        {cameraError && (
          <div className="scan-fallback">
            <Camera size={56} />
            <p>{cameraError}</p>
          </div>
        )}

        <div className="scan-shade" />
        <div className="scan-frame">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="scan-status">
          <ScanLine size={20} />
          <span>{scanned ? "Marker locked" : "Scanning marker..."}</span>
        </div>

        {scanned && (
          <section className={`scan-result ${isToolMode ? "tool" : "fault"}`}>
            <div className="scan-result-icon">
              {isToolMode ? <Wrench size={28} /> : <AlertTriangle size={28} />}
            </div>
            <div>
              <h2>{resultTitle}</h2>
              {isToolMode ? (
                <>
                  <p><strong>Torque Wrench T-001</strong></p>
                  <p>Storage: Cabinet A — Bay 3</p>
                  <p>Status: <span className="ok-text">Working</span></p>
                </>
              ) : (
                <>
                  <p><strong>F-001 Track Damage</strong></p>
                  <p>Severity: <span className="danger-text">High</span></p>
                  <p>Location: Depot 1 — Bay 3</p>
                </>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="scan-actions">
        <button type="button" onClick={() => setScanned(false)}>
          <RotateCcw size={20} /> Rescan
        </button>
        {isToolMode ? (
          <button type="button" className="primary" onClick={() => navigate("/tools")}>
            <CheckCircle size={20} /> Save Tool Scan
          </button>
        ) : (
          <button type="button" className="primary" onClick={() => navigate("/report-fault")}>
            <AlertTriangle size={20} /> Report Fault
          </button>
        )}
      </footer>
    </div>
  );
}
