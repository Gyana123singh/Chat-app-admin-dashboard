import axios from "axios";

const instanceApi = axios.create({
  baseURL: "https://chat-app-1-qvl9.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

instanceApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    if (!config.url.includes("/admin/login")) {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

export default instanceApi;


// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor
// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("authToken");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
