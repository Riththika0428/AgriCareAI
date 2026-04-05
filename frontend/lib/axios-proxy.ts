// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api",
//   headers: { "Content-Type": "application/json" },
// });

// // Auto-attach JWT to every request
// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("agriai_token");
//       if (token) config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Auto-logout on 401
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 && typeof window !== "undefined") {
//       localStorage.removeItem("agriai_token");
//       localStorage.removeItem("agriai_user");
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

// // ── Auth ──────────────────────────────────────────────────
// export const authAPI = {
//   // register: (data: { name: string; email: string; password: string }) =>
//   //   api.post("/auth/register", data),
//   register: (data: { name: string; email: string; password: string; role?: string }) =>
//   api.post("/auth/register", data),
//   login: (data: { email: string; password: string }) =>
//     api.post("/auth/login", data),
//   logout: () => api.post("/auth/logout"),
//   me:     () => api.get("/auth/me"),
//   forgotPassword: (email: string) =>
//     api.post("/auth/forgotpassword", { email }),
// };

// // ── Products ──────────────────────────────────────────────
// export const productAPI = {
//   getAll:        (query?: string) => api.get(`/products${query ? "?" + query : ""}`),
//   getById:       (id: string)     => api.get(`/products/${id}`),
//   getMyProducts: ()               => api.get("/products/my/list"),
//   create:        (data: object)   => api.post("/products", data),
//   update:        (id: string, data: object) => api.put(`/products/${id}`, data),
//   remove:        (id: string)     => api.delete(`/products/${id}`),
//   adminGetAll:   ()               => api.get("/products/admin/all"),
// };

// // ── Orders ────────────────────────────────────────────────
// export const orderAPI = {
//   getFarmerOrders: (status?: string) =>
//     api.get(`/orders/farmer${status && status !== "All" ? `?status=${status}` : ""}`),
//   getMyOrders:     ()               => api.get("/orders/my"),
//   getById:         (id: string)     => api.get(`/orders/${id}`),
//   updateStatus:    (id: string, orderStatus: string) =>
//     api.put(`/orders/${id}/status`, { orderStatus }),
//   cancel:          (id: string)     => api.put(`/orders/${id}/cancel`),
//   create:          (data: object)   => api.post("/orders", data),
//   adminGetAll:     ()               => api.get("/orders/admin/all"),
// };

// // ── Profile API ────────────────────────────────────────────
// export const profileAPI = {
//   getMe:     ()             => api.get("/profile/me"),
//   save:      (data: object) => api.put("/profile/me", data),
//   getStatus: ()             => api.get("/profile/me/status"),
// };

// // ── Disease / Crop Doctor API ──────────────────────────────
// export const diseaseAPI = {
//   // POST multipart/form-data — axios handles FormData content-type automatically
//   scan: (formData: FormData) =>
//     api.post("/diseases/scan", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     }),
 
//   // GET my scan history
//   getMy: () => api.get("/diseases/my"),
 
//   // GET single scan by id
//   getById: (id: string) => api.get(`/diseases/${id}`),
 
//   // PUT update treatment status + notes
//   updateStatus: (id: string, status: string, notes?: string) =>
//     api.put(`/diseases/${id}/status`, { status, notes }),
 
//   // DELETE a scan
//   remove: (id: string) => api.delete(`/diseases/${id}`),
 
//   // GET admin all scans
//   adminGetAll: () => api.get("/diseases/admin/all"),
// };
 
// // ── Add this to your existing lib/axios-proxy.ts ──────────
// // (paste at the bottom of the file)

// export const subscriptionAPI = {
//   // Get checkout URL → redirect to Stripe
//   checkout:  ()   => api.post("/subscriptions/checkout"),
//   // Get current subscription status
//   getMy:     ()   => api.get("/subscriptions/my"),
//   // Cancel subscription (at period end)
//   cancel:    ()   => api.put("/subscriptions/cancel"),
//   // Admin: get all subscriptions
//   adminAll:  ()   => api.get("/subscriptions/admin/all"),
// };

// export const nutritionAPI = {
//   getVeggies:    ()                               => api.get("/nutrition/vegetables"),
//   getToday:      ()                               => api.get("/nutrition/today"),
//   getWeekly:     ()                               => api.get("/nutrition/weekly"),
//   addEntry:      (vegetable:string,grams:number)  => api.post("/nutrition/entry",{vegetable,grams}),
//   removeEntry:   (entryId:string)                 => api.delete(`/nutrition/entry/${entryId}`),
// };


// // ── Add this to your lib/axios-proxy.ts ───────────────
// // Paste at the bottom of the file

// export const weatherAPI = {
//   // GET live weather for a district
//   // GET /api/weather/:district
//   getByDistrict: (district: string) =>
//     api.get(`/weather/${encodeURIComponent(district)}`),

//   // GET all Sri Lanka districts list
//   // GET /api/weather/districts
//   getDistricts: () => api.get("/weather/districts"),

//   // POST save weather alert to farmer's record
//   // POST /api/weather/save
//   save: (data: object) => api.post("/weather/save", data),

//   // GET farmer's saved weather alerts
//   // GET /api/weather/my/alerts
//   getMy: () => api.get("/weather/my/alerts"),

//   // DELETE a saved weather alert
//   // DELETE /api/weather/:id
//   remove: (id: string) => api.delete(`/weather/${id}`),
// };

// // ── Admin ─────────────────────────────────────────────────
// // All admin-only endpoints grouped for clarity
// export const adminAPI = {
//   // Users
//   getAllUsers:          ()                              => api.get("/auth/users"),
//   getUserById:         (id: string)                    => api.get(`/auth/users/${id}`),
//   updateUserStatus:    (id: string, status: string)    => api.put(`/auth/users/${id}/status`, { status }),
//   deleteUser:          (id: string)                    => api.delete(`/auth/users/${id}`),
// };
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Request: auto-attach JWT ─────────────────────────────────────────────────
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

// ─── Response: auto-logout on 401 ────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearAuthAndRedirect();
    }
    return Promise.reject(error);
  }
);

// ─── Auth helpers (used by every dashboard page) ──────────────────────────────

/**
 * Wipes all auth state and sends the user to the landing page.
 * Call this on logout OR whenever a 401 is received.
 */
export function clearAuthAndRedirect(): void {
  localStorage.removeItem("agriai_token");
  localStorage.removeItem("agriai_user");
  // Replace current history entry so the back button cannot return here
  window.location.replace("/");
}

/**
 * Returns the stored user object, or null if nothing is saved.
 * Does NOT validate against the server — use validateSession() for that.
 */
export function getStoredUser(): { _id: string; name: string; email: string; role: string } | null {
  try {
    const raw = localStorage.getItem("agriai_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Hits GET /api/auth/me with the stored token.
 * Returns the live user from the server, or null if the token is missing/invalid.
 * Always bypasses the browser cache (cache: "no-store").
 */
export async function validateSession(): Promise<{ _id: string; name: string; email: string; role: string } | null> {
  const token = localStorage.getItem("agriai_token");
  if (!token) return null;

  try {
    // Use native fetch so we can set cache: "no-store"
    // This forces a real network hit and prevents stale cached responses
    const res = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",       // ← key: bypass HTTP cache on every check
    });

    if (!res.ok) {
      // Token is invalid or expired on the server
      localStorage.removeItem("agriai_token");
      localStorage.removeItem("agriai_user");
      return null;
    }

    const data = await res.json();
    // Normalise: some endpoints return { user: {...} }, others return the user directly
    const user = data.user ?? data;

    // Keep localStorage in sync with what the server says
    localStorage.setItem("agriai_user", JSON.stringify(user));
    return user;
  } catch {
    return null;
  }
}

export default api;

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
  forgotPassword: (email: string) => api.post("/auth/forgotpassword", { email }),
};

// ─── Products API ─────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:        (query?: string) => api.get(`/products${query ? "?" + query : ""}`),
  getById:       (id: string)     => api.get(`/products/${id}`),
  getMyProducts: ()               => api.get("/products/my/list"),
  create:        (data: object)   => api.post("/products", data),
  update:        (id: string, data: object) => api.put(`/products/${id}`, data),
  remove:        (id: string)     => api.delete(`/products/${id}`),
  adminGetAll:   ()               => api.get("/products/admin/all"),
};

// ─── Orders API ───────────────────────────────────────────────────────────────
export const orderAPI = {
  getFarmerOrders: (status?: string) =>
    api.get(`/orders/farmer${status && status !== "All" ? `?status=${status}` : ""}`),
  getMyOrders:  ()               => api.get("/orders/my"),
  getById:      (id: string)     => api.get(`/orders/${id}`),
  updateStatus: (id: string, orderStatus: string) =>
    api.put(`/orders/${id}/status`, { orderStatus }),
  cancel:       (id: string)     => api.put(`/orders/${id}/cancel`),
  create:       (data: object)   => api.post("/orders", data),
  adminGetAll:  ()               => api.get("/orders/admin/all"),
};

// ─── Profile API ──────────────────────────────────────────────────────────────
export const profileAPI = {
  getMe:     ()             => api.get("/profile/me"),
  save:      (data: object) => api.put("/profile/me", data),
  getStatus: ()             => api.get("/profile/me/status"),
};

// ─── Disease API ──────────────────────────────────────────────────────────────
export const diseaseAPI = {
  scan: (formData: FormData) =>
    api.post("/diseases/scan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMy:       ()             => api.get("/diseases/my"),
  getById:     (id: string)   => api.get(`/diseases/${id}`),
  updateStatus: (id: string, status: string, notes?: string) =>
    api.put(`/diseases/${id}/status`, { status, notes }),
  remove:      (id: string)   => api.delete(`/diseases/${id}`),
  adminGetAll: ()             => api.get("/diseases/admin/all"),
};

// ─── Subscription API ─────────────────────────────────────────────────────────
export const subscriptionAPI = {
  checkout: ()  => api.post("/subscriptions/checkout"),
  getMy:    ()  => api.get("/subscriptions/my"),
  cancel:   ()  => api.put("/subscriptions/cancel"),
  adminAll: ()  => api.get("/subscriptions/admin/all"),
};

// ─── Nutrition API ────────────────────────────────────────────────────────────
export const nutritionAPI = {
  getVeggies:  ()                              => api.get("/nutrition/vegetables"),
  getToday:    ()                              => api.get("/nutrition/today"),
  getWeekly:   ()                              => api.get("/nutrition/weekly"),
  addEntry:    (vegetable: string, grams: number) => api.post("/nutrition/entry", { vegetable, grams }),
  removeEntry: (entryId: string)              => api.delete(`/nutrition/entry/${entryId}`),
  // Inside nutritionAPI object:
  getAiAdvice: () => api.get("/nutrition/ai-advice"),
};

// ─── Weather API ──────────────────────────────────────────────────────────────
export const weatherAPI = {
  getByDistrict: (district: string) => api.get(`/weather/${encodeURIComponent(district)}`),
  getDistricts:  ()                 => api.get("/weather/districts"),
  save:          (data: object)     => api.post("/weather/save", data),
  getMy:         ()                 => api.get("/weather/my/alerts"),
  remove:        (id: string)       => api.delete(`/weather/${id}`),
};

// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminAPI = {
  getAllUsers:       ()                           => api.get("/auth/users"),
  getUserById:      (id: string)                 => api.get(`/auth/users/${id}`),
  updateUserStatus: (id: string, status: string) => api.put(`/auth/users/${id}/status`, { status }),
  deleteUser:       (id: string)                 => api.delete(`/auth/users/${id}`),
};