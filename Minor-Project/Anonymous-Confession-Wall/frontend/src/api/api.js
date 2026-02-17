import axios from "axios";

// Single axios instance — all requests carry cookies for session auth
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true, // needed for passport session cookies
});

// ── Auth ─────────────────────────────────────────────────────
export const fetchUser    = ()          => api.get("/api/auth/me");
export const logoutUser   = ()          => api.post("/api/auth/logout");

// ── Confessions ───────────────────────────────────────────────
export const getConfessions    = ()              => api.get("/api/confessions");
export const createConfession  = (data)          => api.post("/api/confessions", data);
export const updateConfession  = (id, data)      => api.put(`/api/confessions/${id}`, data);
export const deleteConfession  = (id, secretCode)=> api.delete(`/api/confessions/${id}`, { data: { secretCode } });
export const reactConfession   = (id, type)      => api.post(`/api/confessions/${id}/react`, { type });