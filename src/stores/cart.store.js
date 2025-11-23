// src/stores/cart.store.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("cartItems")) || [],
  }),

  getters: {
    totalQty: (state) =>
      state.items.reduce((sum, item) => sum + item.qty, 0),

    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.qty, 0),
  },

  actions: {
    addItem(product) {
      const existing = this.items.find((item) => item.id === product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.picture_url,
          qty: 1,
        });
      }
      this.saveToLocalStorage();
    },

    removeItem(index) {
      this.items.splice(index, 1);
      this.saveToLocalStorage();
    },

    increaseQty(index) {
      this.items[index].qty++;
      this.saveToLocalStorage();
    },

    decreaseQty(index) {
      if (this.items[index].qty > 1) {
        this.items[index].qty--;
        this.saveToLocalStorage();
      }
    },

    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem("cartItems", JSON.stringify(this.items));
    },
  },
});
