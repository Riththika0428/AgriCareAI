import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("agriai_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("agriai_token");
      localStorage.removeItem("agriai_user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  // register: (data: { name: string; email: string; password: string }) =>
  //   api.post("/auth/register", data),
  register: (data: { name: string; email: string; password: string; role?: string }) =>
  api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me:     () => api.get("/auth/me"),
  forgotPassword: (email: string) =>
    api.post("/auth/forgotpassword", { email }),
};

// ── Products ──────────────────────────────────────────────
export const productAPI = {
  getAll:        (query?: string) => api.get(`/products${query ? "?" + query : ""}`),
  getById:       (id: string)     => api.get(`/products/${id}`),
  getMyProducts: ()               => api.get("/products/my/list"),
  create:        (data: object)   => api.post("/products", data),
  update:        (id: string, data: object) => api.put(`/products/${id}`, data),
  remove:        (id: string)     => api.delete(`/products/${id}`),
  adminGetAll:   ()               => api.get("/products/admin/all"),
};

// ── Orders ────────────────────────────────────────────────
export const orderAPI = {
  getFarmerOrders: (status?: string) =>
    api.get(`/orders/farmer${status && status !== "All" ? `?status=${status}` : ""}`),
  getMyOrders:     ()               => api.get("/orders/my"),
  getById:         (id: string)     => api.get(`/orders/${id}`),
  updateStatus:    (id: string, orderStatus: string) =>
    api.put(`/orders/${id}/status`, { orderStatus }),
  cancel:          (id: string)     => api.put(`/orders/${id}/cancel`),
  create:          (data: object)   => api.post("/orders", data),
  adminGetAll:     ()               => api.get("/orders/admin/all"),
};

// ── Profile API ────────────────────────────────────────────
export const profileAPI = {
  getMe:     ()             => api.get("/profile/me"),
  save:      (data: object) => api.put("/profile/me", data),
  getStatus: ()             => api.get("/profile/me/status"),
};