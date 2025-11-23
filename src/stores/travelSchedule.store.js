import { defineStore } from "pinia";
import { axiosWrapper } from "@/helper/axios-wrapper";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useTravelScheduleStore = defineStore("travelSchedule", {
  state: () => ({
    schedules: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSchedules() {
      this.loading = true;
      this.error = null;

      try {
        const res = await axiosWrapper.get(`${baseUrl}/admin/schedules`);
        this.schedules = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error("ERROR FETCH:", err);
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async createSchedule(data) {
      try {
        await axiosWrapper.post(`${baseUrl}/admin/schedules`, data);
        await this.fetchSchedules();
      } catch (err) {
        console.error("ERROR CREATE:", err);
        this.error = err;
      }
    },

    async updateSchedule(id, data) {
      try {
        await axiosWrapper.put(`${baseUrl}/admin/schedules/${id}`, data);
        await this.fetchSchedules();
      } catch (err) {
        console.error("ERROR UPDATE:", err);
        this.error = err;
      }
    },

    async deleteSchedule(id) {
      try {
        await axiosWrapper.delete(`${baseUrl}/admin/schedules/${id}`);
        this.schedules = this.schedules.filter((s) => s.id !== id);
      } catch (err) {
        console.error("ERROR DELETE:", err);
        this.error = err;
      }
    },
  },
});
