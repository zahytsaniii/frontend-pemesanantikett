<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from 'axios';

const route = useRoute();
const router = useRouter();

// Total pembayaran dari query parameter
const total = ref(Number(route.query.total) || 0);

// Tanggal sekarang
const date = ref(new Date());
const formattedDate = computed(() =>
  date.value.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
);

// Tombol kembali
function handleBack() {
  router.push("/home"); 
}

// Tombol cetak invoice
function printInvoice() {
  const bookingId = route.query.bookingId;
  if (!bookingId) return alert("Booking ID tidak tersedia");

  // Ambil token dari localStorage
  const userToken = localStorage.getItem('token');
  if (!userToken) return alert("Token user tidak tersedia");

  axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/invoice/${bookingId}`,
    {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    }
  )
  .then(res => {
    const file = new Blob([res.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  })
  .catch(err => {
    console.error(err);
    alert('Gagal memuat invoice');
  });
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <a-card class="w-[350px] text-center rounded-2xl shadow-md">
      <div class="flex flex-col items-center space-y-2 py-4">
        <img
          src="@/assets/image/succes.svg"
          alt="success icon"
          class="w-32 h-32"
        />
        <p class="text-green-600 font-semibold text-lg">Pembayaran Sukses</p>

        <div>
          <p class="text-gray-500 text-sm">Total</p>
          <p class="text-lg font-bold text-gray-900">
            Rp{{ total.toLocaleString("id-ID") }}
          </p>
          <p class="text-gray-400 text-xs mt-1">{{ formattedDate }}</p>
        </div>

        <div class="flex gap-2 w-full mt-3">
          <a-button
            type="default"
            class="flex-1 rounded-lg border-gray-300"
            @click="handleBack"
          >
            ← Kembali
          </a-button>

          <a-button
            type="primary"
            class="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700"
            @click="printInvoice"
          >
            Cetak Invoice
          </a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.ant-card {
  border: none;
}
</style>
