import { defineStore } from "pinia";
import { axiosWrapper } from "@/helper/axios-wrapper.js";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useBookingStore = defineStore({
  id: "booking",
  state: () => ({
    schedules: [],
    loading: false,
    error: null,
    lastOrderId: null,
  }),
  actions: {
    async getSchedules(params = {}) {
      this.loading = true;
      this.error = null;

      try {
        const res = await axiosWrapper.get(`${baseUrl}/schedules`, params);

        this.schedules = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        return this.schedules;
      } catch (err) {
        this.error = err;
        console.error("Gagal mengambil data jadwal:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async bookTicket(data) {
      this.loading = true;
      this.error = null;

      try {
        const res = await axiosWrapper.post(`${baseUrl}/book`, data);

        // simpan ID order terakhir
        this.lastOrderId = res.data?.data?.id;

        return res.data?.data; // return data order
        } catch (err) {
        this.error = err;
        console.error("Gagal melakukan booking:", err);
        throw err;
        } finally {
        this.loading = false;
        }
    },

    async getOrderById(id) {
        this.loading = true;
        this.error = null;
        try {
        const res = await axiosWrapper.get(`${baseUrl}/bookings/${id}`);
        return res.data?.data; // pastikan response data sesuai
        } catch (err) {
        this.error = err;
        console.error("Gagal mengambil detail order:", err);
        throw err;
        } finally {
        this.loading = false;
        }
    },

    async cancelBooking(id) {
        this.loading = true;
        this.error = null;
        try {
            await axiosWrapper.post(`${baseUrl}/bookings/${id}/cancel`); // ganti patch dengan post
        } catch (err) {
            this.error = err;
            console.error("Gagal membatalkan booking:", err);
            throw err;
        } finally {
            this.loading = false;
        }
    },

    async payBooking(id) {
      this.loading = true;
      this.error = null;

      try {
          const response = await axiosWrapper.post(`${baseUrl}/bookings/${id}/pay`);
          return response.data; 
      } catch (err) {
          this.error = err;
          console.error("Gagal melakukan pembayaran:", err);
          throw err;
      } finally {
          this.loading = false;
      }
    },

    async getHistory() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axiosWrapper.get(`${baseUrl}/history`);
        this.bookings = Array.isArray(res.data) ? res.data : res.data?.data || [];
        return this.bookings;
      } catch (err) {
        this.error = err;
        console.error("Gagal mengambil riwayat pemesanan:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
