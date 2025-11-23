import { defineStore } from "pinia";
import { axiosWrapper } from "@/helper/axios-wrapper.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useCategoryStore = defineStore({
  id: "category",
  state: () => ({
    categories: [],
    category: null,
    loading: false,
    error: null,
  }),
  actions: {
    async getAll() {
      this.loading = true;
      try {
        const res = await axiosWrapper.get(`${baseUrl}/category`);
        this.categories = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
      } catch (err) {
        this.error = err;
        console.error("Gagal mengambil kategori:", err);
      } finally {
        this.loading = false;
      }
    },

    async getById(id) {
      this.loading = true;
      try {
        const res = await axiosWrapper.get(`${baseUrl}/category/${id}`);
        if (res.status === 200) {
          this.category = res.data;
        }
      } catch (err) {
        this.error = err;
        console.error(`Gagal mengambil kategori dengan ID ${id}:`, err);
      } finally {
        this.loading = false;
      }
    },

    async create(data) {
      this.loading = true;
      try {
        const res = await axiosWrapper.post(`${baseUrl}/category`, data, true);
        if (res.status === 201 || res.status === 200) {
          this.categories.push(res.data);
        }
        return res;
      } catch (err) {
        this.error = err;
        console.error("Gagal menambah kategori:", err);
      } finally {
        this.loading = false;
      }
    },

    async update(id, data) {
      this.loading = true;
      try {
        const res = await axiosWrapper.put(
          `${baseUrl}/category/${id}`,
          data,
          true
        );
        if (res.status === 200) {
          const index = this.categories.findIndex((c) => c.id === id);
          if (index !== -1) {
            this.categories[index] = res.data;
          }
        }
        return res;
      } catch (err) {
        this.error = err;
        console.error("Gagal mengupdate kategori:", err);
      } finally {
        this.loading = false;
      }
    },

    async delete(id) {
      this.loading = true;
      try {
        const res = await axiosWrapper.delete(`${baseUrl}/category/${id}`);
        if (res.status === 200 || res.status === 204) {
          this.categories = this.categories.filter((c) => c.id !== id);
        }
        return res;
      } catch (err) {
        this.error = err;
        console.error("Gagal menghapus kategori:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});
