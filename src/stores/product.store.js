import { defineStore } from "pinia";
import { axiosWrapper } from "@/helper/axios-wrapper.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const useProductStore = defineStore({
  id: "product",
  state: () => ({
    products: [],
    product: null,
    loading: false,
    error: null,
  }),
  actions: {
    async getAll() {
      this.loading = true;
      try {
        const res = await axiosWrapper.get(`${baseUrl}/product`);
        this.products = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
      } catch (err) {
        this.error = err;
        console.error("Gagal mengambil data produk:", err);
      } finally {
        this.loading = false;
      }
    },

    async getById(id) {
      this.loading = true;
      try {
        const res = await axiosWrapper.get(`${baseUrl}/product/${id}`);
        this.product = res.data || null;
      } catch (err) {
        this.error = err;
        console.error(`Gagal mengambil produk dengan ID ${id}:`, err);
      } finally {
        this.loading = false;
      }
    },

    async create(formData) {
      this.loading = true;
      try {
        const res = await axiosWrapper.post(
          `${baseUrl}/product`,
          formData,
          false,
          "multipart/form-data"
        );

        // res sudah langsung data backend
        if (res?.data) {
          this.products.push(res.data);
          return res;
        } else {
          throw new Error("Gagal menambahkan produk");
        }
      } catch (err) {
        this.error = err;
        console.error("Gagal menambah produk:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async update(id, data) {
      this.loading = true;
      try {
        const res = await axiosWrapper.put(`${baseUrl}/product/${id}`, data);
        if (res?.data) {
          const index = this.products.findIndex((p) => p.id === id);
          if (index !== -1) {
            this.products[index] = res.data;
          }
        }
        return res;
      } catch (err) {
        this.error = err;
        console.error("Gagal mengupdate produk:", err);
      } finally {
        this.loading = false;
      }
    },

    async delete(id) {
      this.loading = true;
      try {
        const res = await axiosWrapper.delete(`${baseUrl}/product/${id}`);
        if (res) {
          this.products = this.products.filter((p) => p.id !== id);
        }
        return res;
      } catch (err) {
        this.error = err;
        console.error("Gagal menghapus produk:", err);
      } finally {
        this.loading = false;
      }
    },
  },
});
