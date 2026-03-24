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

// ── Disease / Crop Doctor API ──────────────────────────────
export const diseaseAPI = {
  // POST multipart/form-data — axios handles FormData content-type automatically
  scan: (formData: FormData) =>
    api.post("/diseases/scan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
 
  // GET my scan history
  getMy: () => api.get("/diseases/my"),
 
  // GET single scan by id
  getById: (id: string) => api.get(`/diseases/${id}`),
 
  // PUT update treatment status + notes
  updateStatus: (id: string, status: string, notes?: string) =>
    api.put(`/diseases/${id}/status`, { status, notes }),
 
  // DELETE a scan
  remove: (id: string) => api.delete(`/diseases/${id}`),
 
  // GET admin all scans
  adminGetAll: () => api.get("/diseases/admin/all"),
};
 
// ── Add this to your existing lib/axios-proxy.ts ──────────
// (paste at the bottom of the file)

export const subscriptionAPI = {
  // Get checkout URL → redirect to Stripe
  checkout:  ()   => api.post("/subscriptions/checkout"),
  // Get current subscription status
  getMy:     ()   => api.get("/subscriptions/my"),
  // Cancel subscription (at period end)
  cancel:    ()   => api.put("/subscriptions/cancel"),
  // Admin: get all subscriptions
  adminAll:  ()   => api.get("/subscriptions/admin/all"),
};

export const nutritionAPI = {
  getVeggies:    ()                               => api.get("/nutrition/vegetables"),
  getToday:      ()                               => api.get("/nutrition/today"),
  getWeekly:     ()                               => api.get("/nutrition/weekly"),
  addEntry:      (vegetable:string,grams:number)  => api.post("/nutrition/entry",{vegetable,grams}),
  removeEntry:   (entryId:string)                 => api.delete(`/nutrition/entry/${entryId}`),
};
 