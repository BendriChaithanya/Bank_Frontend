import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "bankbackend-production-f72d.up.railway.app"
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token && config.url !== "/api/auth/login") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default API;