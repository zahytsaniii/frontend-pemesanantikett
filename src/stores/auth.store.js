import { defineStore, getActivePinia } from "pinia";
import { axiosWrapper } from "@/helper/axios-wrapper.js";
import router from "@/router/index.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    authError: null,
  }),

  actions: {
    async login(data) {
      try {
        const res = await axiosWrapper.post(`${baseUrl}/login`, data, true);

        // Sesuaikan dengan response backend
        const user = {
          ...res.data.user,
          token: res.data.token,
        };

        this.user = user;
        this.token = res.data.token;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", res.data.token);

        // Redirect sesuai role
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/home");
        }

      } catch (err) {
        this.authError = err;
        console.error("Login gagal:", err);
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.authError = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      const pinia = getActivePinia();
      if (pinia) {
        Object.values(pinia._s).forEach((store) => store.$reset());
      }

      router.push("/");
    },
  },
});
