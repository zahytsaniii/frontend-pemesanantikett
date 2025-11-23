import { defineStore } from "pinia";
import { axiosWrapper } from "@/helper/axios-wrapper.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useAdminReportStore = defineStore({
  id: "adminReport",
  state: () => ({
    schedules: [],
    passengers: [],
    loading: false,
    error: null,
  }),
  actions: {
    /** GET: Semua laporan penumpang per jadwal */
    async getAllReports() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axiosWrapper.get(`${baseUrl}/reports/passengers`);
        this.schedules = Array.isArray(res.data) ? res.data : res.data?.data || [];
        return this.schedules;
      } catch (err) {
        this.error = err;
        console.error("Gagal mengambil laporan:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /** GET: Detail 1 jadwal */
    async getPassengerDetail(id) {
        this.loading = true;
        this.error = null;
        try {
            const res = await axiosWrapper.get(`${baseUrl}/reports/passengers/${id}`);
            
            const bookings = res.data?.bookings || [];
            
            this.passengers = bookings;
            return bookings;
        } catch (err) {
            this.error = err;
            console.error("Gagal mengambil detail penumpang:", err);
            throw err;
        } finally {
            this.loading = false;
        }
    }
  },
});
