<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingStore } from "@/stores/booking.store.js";
import { message, Modal } from "ant-design-vue";

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();
const order = ref(null);
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  try {
    const orderData = await bookingStore.getOrderById(route.params.id);
    order.value = orderData;
  } catch (err) {
    message.error("Gagal memuat detail pesanan");
  } finally {
    isLoading.value = false;
  }
});

const goToPayment = () => {
  router.push(`/payment/${order.value.id}`);
};

const cancelOrder = () => {
  Modal.confirm({
    title: "Batalkan Pesanan",
    content: "Apakah kamu yakin ingin membatalkan pesanan ini?",
    okText: "Ya, batalkan",
    cancelText: "Batal",
    async onOk() {
      try {
        await bookingStore.cancelBooking(order.value.id);
        message.success("Pesanan berhasil dibatalkan");
        router.push("/home"); // redirect ke halaman jadwal
      } catch (err) {
        message.error(err.response?.data?.message || "Gagal membatalkan pesanan");
      }
    },
  });
};
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Review Pesanan</h1>

    <div v-if="isLoading" class="text-gray-500">Memuat data pesanan...</div>

    <div v-else-if="order" class="bg-white p-4 rounded-xl shadow space-y-4">
      <p class="font-bold text-lg">{{ order.route.departure_city }} → {{ order.route.destination }}</p>
      <p class="text-gray-600">
        Jadwal: {{ order.route.date }} • {{ order.route.time }}
      </p>
      <p>Kursi dipesan: {{ order.seats }}</p>
      <p class="text-blue-600 font-bold text-xl">
        Total: Rp {{ (order.seats * order.route.price).toLocaleString("id-ID") }}
      </p>

      <!-- ACTION BUTTONS -->
      <div class="flex gap-4 mt-4">
        <a-button type="default" block danger @click="cancelOrder">
          Batalkan Pesanan
        </a-button>
        <a-button type="primary" block @click="goToPayment">
          Bayar Sekarang
        </a-button>
      </div>
    </div>

    <div v-else class="text-gray-500">Pesanan tidak ditemukan.</div>
  </div>
</template>
