// lib/axios.ts
// ─────────────────────────────────────────────
// Central axios instance for all API calls
// Import this in any component:
//   import api, { authAPI, productAPI } from "@/lib/axios"
// ─────────────────────────────────────────────

import axios from "axios";

// Create axios instance with base URL from .env.local
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ──
// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("agriai_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──
// If token is expired (401), clear localStorage and redirect to home
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("agriai_token");
        localStorage.removeItem("agriai_user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── AUTH API ──────────────────────────────────
export const authAPI = {
  // Register new user
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => api.post("/auth/register", data),

  // Login
  login: (data: {
    email: string;
    password: string;
  }) => api.post("/auth/login", data),

  // Logout
  logout: () => api.post("/auth/logout"),

  // Get my profile (requires token)
  me: () => api.get("/auth/me"),

  // Forgot password
  forgotPassword: (email: string) =>
    api.post("/auth/forgotpassword", { email }),

  // Reset password
  resetPassword: (token: string, password: string) =>
    api.put(`/auth/resetpassword/${token}`, { password }),

  // Get all users (admin only)
  getAllUsers: () => api.get("/auth/users"),
};

// ── PRODUCT API ───────────────────────────────
export const productAPI = {
  // Get all products (public) — optional query string
  // Example: productAPI.getAll("category=Fruit&type=Organic")
  getAll: (query?: string) =>
    api.get(`/products${query ? "?" + query : ""}`),

  // Get single product by ID (public)
  getById: (id: string) => api.get(`/products/${id}`),

  // Get my products (farmer only)
  getMyProducts: () => api.get("/products/my/list"),

  // Create product (farmer only)
  create: (data: {
    cropName: string;
    category: string;
    type: string;
    price: number;
    stock: number;
    harvestDate?: string;
    organicTreatmentHistory?: string;
  }) => api.post("/products", data),

  // Update product (farmer owner or admin)
  update: (id: string, data: object) => api.put(`/products/${id}`, data),

  // Delete product (farmer owner or admin)
  remove: (id: string) => api.delete(`/products/${id}`),

  // Admin get all products
  adminGetAll: () => api.get("/products/admin/all"),
};