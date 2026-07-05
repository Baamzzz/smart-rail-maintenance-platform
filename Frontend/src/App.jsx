import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/Login/Login.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import FaultDashboard from "./Pages/FaultDashboard/FaultDashboard.jsx";
import ToolTracker from "./Pages/ToolTracker/ToolTracker.jsx";
import AdminPanel from "./Pages/AdminPanel/AdminPanel.jsx";
import Notifications from "./Pages/Notifications/Notifications.jsx";
import Settings from "./Pages/Settings/Settings.jsx";
import RailMap from "./Pages/RailMap/RailMap.jsx";
import ARInterface from "./Pages/ARInterface/ARInterface.jsx";
import ARScan from "./Pages/ARScan/ARScan.jsx";
import ARMarkers from "./Pages/ARMarkers/ARMarkers.jsx";
import "./Pages/Dashboard/Dashboard.css";
import MaterialStock from "./Pages/MaterialStock/MaterialStock.jsx";
import ReportToolFault from "./Pages/ReportToolFault/ReportToolFault.jsx";
import TrainFaultReport from "./Pages/TrainFaultReport/TrainFaultReport";
import "./mobile-fixes.css";

// Keeps protected pages unavailable until a user has logged in.
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
<Routes>
  <Route path="/" element={<Login />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/faults"
    element={
      <ProtectedRoute>
        <FaultDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/tools"
    element={
      <ProtectedRoute>
        <ToolTracker />
      </ProtectedRoute>
    }
  />

  <Route
    path="/materials"
    element={
      <ProtectedRoute>
        <MaterialStock />
      </ProtectedRoute>
    }
  />

  <Route
    path="/report-tool"
    element={
      <ProtectedRoute>
        <ReportToolFault />
      </ProtectedRoute>
    }
  />

  <Route
    path="/notifications"
    element={
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    }
  />

  <Route
    path="/settings"
    element={
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    }
  />

  <Route
    path="/railmap"
    element={
      <ProtectedRoute>
        <RailMap />
      </ProtectedRoute>
    }
  />

  <Route
    path="/ar"
    element={
      <ProtectedRoute>
        <ARInterface />
      </ProtectedRoute>
    }
  />

  <Route
    path="/ar-scan"
    element={
      <ProtectedRoute>
        <ARScan />
      </ProtectedRoute>
    }
  />

  <Route
    path="/markers"
    element={
      <ProtectedRoute>
        <ARMarkers />
      </ProtectedRoute>
    }
  />

  <Route
    path="/report-fault"
    element={
      <ProtectedRoute>
        <TrainFaultReport />
      </ProtectedRoute>
    }
  />

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      {localStorage.getItem("role") === "admin" ? (
        <AdminPanel />
      ) : (
        <Navigate to="/admin" />
      )}
    </ProtectedRoute>
  }
/>
</Routes>
  );
}

export default App;