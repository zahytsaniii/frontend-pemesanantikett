<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingStore } from "@/stores/booking.store.js";
import { message } from "ant-design-vue";

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

const order = ref(null);
const loading = ref(false);

// Ambil data booking saat halaman dimuat
onMounted(async () => {
  try {
    order.value = await bookingStore.getOrderById(route.params.id);
  } catch {
    message.error("Gagal memuat detail pesanan");
  }
});

// Submit payment tanpa bukti bayar dengan loading
const payNow = async () => {
  loading.value = true;

  try {
    await bookingStore.payBooking(order.value.id); // panggil API pembayaran

    // Hitung total bayar dari order
    const paidAmount = order.value.seats * order.value.route.price;

    message.success("Pembayaran berhasil!");

    // Pindah ke halaman payment-status dengan total
    router.push({
      path: "/payment-status",
      query: { total: paidAmount, bookingId: order.value.id }
    });
  } catch (err) {
    console.error(err);
    message.error(err.response?.data?.message || "Pembayaran gagal");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Pembayaran</h1>

    <div v-if="order" class="bg-white p-4 rounded-xl shadow space-y-3">
      <p class="font-bold text-lg">
        {{ order.route.departure_city }} → {{ order.route.destination }}
      </p>

      <p>Total bayar:</p>
      <p class="text-2xl font-bold text-blue-600">
        Rp {{ (order.seats * order.route.price).toLocaleString("id-ID") }}
      </p>

      <p class="text-gray-600">Metode Pembayaran</p>
      <ul class="list-disc ml-5 text-gray-600">
        <li>BCA - 123456789 (A/N TransKlaten)</li>
        <li>BRI - 999888777</li>
        <li>QRIS (Coming Soon)</li>
      </ul>

      <a-button
        type="primary"
        block
        size="large"
        :loading="loading"
        class="mt-3"
        @click="payNow"
      >
        Konfirmasi Pembayaran
      </a-button>
    </div>

    <div v-else class="text-gray-500">Memuat data pesanan...</div>
  </div>
</template>
