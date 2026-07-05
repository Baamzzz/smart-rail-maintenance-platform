// Shared frontend API layer
// Uses the live backend when available and falls back to mock/localStorage data for demo mode.

import { FAULTS, TOOLS, TASKS, USERS } from "./data/mockData.js";

const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000/api`;

// Base request helper
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: token } : {}),
      ...options.headers,
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || `API request failed (${res.status})`);
  }

  return data;
}

const normaliseFaults = () =>
  Object.values(FAULTS).map((fault) => ({
    id: fault.id,
    markerId: fault.marker,
    type: fault.type,
    location: fault.location,
    severity: fault.severity?.[0]?.toUpperCase() + fault.severity?.slice(1),
    status: "Active",
    reported: fault.reportedDate,
    ...fault,
  }));

const normaliseTools = () =>
  Object.values(TOOLS).map((tool) => ({
    markerId: tool.marker,
    name: tool.name,
    status: tool.condition === "damaged" ? "Faulty" : "Available",
    location: tool.location,
    lastChecked: tool.lastCalibrated,
    ...tool,
  }));

// Authentication helpers
export const auth = {
  async login(username, password) {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: username, password }),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("currentUser", data.user.email || data.user.name || username);
      return data;
    } catch (apiError) {
      const user = USERS.find(
        (u) => (u.username === username || u.name === username || u.id === username) && u.password === password
      );
      if (!user) throw apiError;
      const token = btoa(`${user.id}:${user.role}:${Date.now()}`);
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("currentUser", user.name);
      return { token, user };
    }
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("currentUser");
  },
  getUser() {
    return {
      name: localStorage.getItem("currentUser"),
      role: localStorage.getItem("role"),
    };
  },
  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};

// Fault data helpers
export const faults = {
  async getAll() {
    try {
      return await apiRequest("/faults");
    } catch {
      const stored = JSON.parse(localStorage.getItem("logged_faults") || "[]");
      return [...normaliseFaults(), ...stored];
    }
  },
  async getByMarker(marker) {
    try {
      return await apiRequest(`/faults/marker/${marker}`);
    } catch {
      return FAULTS[marker] || null;
    }
  },
  async logNew(fault) {
    try {
      return await apiRequest("/faults", { method: "POST", body: JSON.stringify(fault) });
    } catch {
      const stored = JSON.parse(localStorage.getItem("logged_faults") || "[]");
      const newFault = { ...fault, id: `F-${Date.now()}`, status: "Active", reported: new Date().toISOString() };
      stored.push(newFault);
      localStorage.setItem("logged_faults", JSON.stringify(stored));
      return newFault;
    }
  },
};

// Tool data helpers
export const tools = {
  async getAll() {
    try {
      return await apiRequest("/tools");
    } catch {
      return normaliseTools();
    }
  },
  async getByMarker(marker) {
    try {
      return await apiRequest(`/tools/marker/${marker}`);
    } catch {
      return TOOLS[marker] || null;
    }
  },
  async reportIssue(toolId, issue) {
    try {
      return await apiRequest("/tools/report", { method: "POST", body: JSON.stringify({ name: toolId, location: "Unknown", severity: issue }) });
    } catch {
      const reports = JSON.parse(localStorage.getItem("tool_reports") || "[]");
      reports.push({ toolId, issue, timestamp: new Date().toISOString() });
      localStorage.setItem("tool_reports", JSON.stringify(reports));
      return { toolId, issue };
    }
  },
};

// Task data helpers
export const tasks = {
  async getAll() {
    try {
      return await apiRequest("/tasks");
    } catch {
      const stored = JSON.parse(localStorage.getItem("tasks") || "null");
      return stored || TASKS;
    }
  },
  async update(id, updates) {
    try {
      return await apiRequest(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(updates) });
    } catch {
      const all = await tasks.getAll();
      const updated = all.map((task) => (task.id === id ? { ...task, ...updates } : task));
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated.find((task) => task.id === id);
    }
  },
};
