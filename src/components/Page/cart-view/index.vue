<script setup>
import { computed } from "vue";
import { useCartStore } from "@/stores/cart.store.js";
import { useRouter } from "vue-router";

const router = useRouter();
const cartStore = useCartStore();

const cartItems = computed(() => cartStore.items);
const totalPrice = computed(() => cartStore.totalPrice);

const increaseQty = (index) => {
  cartStore.increaseQty(index);
};

const decreaseQty = (index) => {
  cartStore.decreaseQty(index);
};

const removeItem = (index) => {
  cartStore.removeItem(index);
};


const goToAddCategory = () => router.push("/add-category");
const goToAddProduct = () => router.push("/add-product");
const goBack = () => {
  router.push("/");
};
const goToPayment = () => {
  router.push({
    path: "/cart-payment",
    query: { total: totalPrice.value },
  });
};
</script>
<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div
      class="flex justify-between items-center bg-white rounded-2xl shadow p-4 mb-6"
    >
      <h1 class="text-2xl font-bold text-blue-600">TransKlaten</h1>

      <div class="flex items-center gap-3">
        <a-button type="primary" size="large" @click="goToAddCategory">+ Tambah Kategori</a-button>
        <a-button type="primary" size="large" @click="goToAddProduct" ghost>+ Tambah Produk</a-button>

        <div
          class="flex justify-start items-center bg-blue-50 border border-blue-200 text-blue-600 rounded-lg"
        >
          <div
            class="flex items-center justify-center bg-blue-600 border border-blue-600 text-white font-semibold rounded-lg w-10 h-10 mr-2"
          >
            <i class="ri-shopping-cart-2-line text-lg"></i>
          </div>
          <span class="flex items-center justify-center text-m"
            >Total Tagihan</span
          >
          <span class="ml-2 mr-2 font-semibold"
            >Rp {{ totalPrice.toLocaleString("id-ID") }}</span
          >
        </div>

        <a-avatar
          size="large"
          src="https://api.dicebear.com/9.x/adventurer/svg?seed=Aldean"
        />
      </div>
    </div>
    <div class="bg-white rounded-2xl shadow p-4">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b text-gray-500">
            <th class="pb-3 w-2/5">Produk</th>
            <th class="pb-3">Harga</th>
            <th class="pb-3">Jumlah</th>
            <th class="pb-3">Sub Total</th>
            <th class="pb-3 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in cartItems"
            :key="index"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="py-3 flex items-center gap-3">
              <img
                :src="item.image"
                alt="product"
                class="w-16 h-16 object-cover rounded-lg"
              />
              <span class="font-medium">{{ item.name }}</span>
            </td>

            <td>Rp {{ item.price.toLocaleString("id-ID") }}</td>

            <td>
              <div class="flex items-center gap-2">
                <a-button
                  shape="circle"
                  size="small"
                  @click="decreaseQty(index)"
                  :disabled="item.qty === 1"
                >
                  <template #icon><i class="ri-subtract-line"></i></template>
                </a-button>

                <span class="w-6 text-center">{{ item.qty }}</span>

                <a-button
                  shape="circle"
                  size="small"
                  @click="increaseQty(index)"
                >
                  <template #icon><i class="ri-add-line"></i></template>
                </a-button>
              </div>
            </td>

            <td>Rp {{ (item.price * item.qty).toLocaleString("id-ID") }}</td>

            <td class="text-right">
              <a class="text-red-500 hover:underline" @click="removeItem(index)"
                >Hapus</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-end gap-3 mt-6">
      <a-button @click="goBack">Kembali</a-button>
      <a-button type="primary" @click="goToPayment">Bayar</a-button>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0 8px;
}
</style>
