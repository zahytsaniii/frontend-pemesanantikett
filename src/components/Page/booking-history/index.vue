<script setup>
import { ref, onMounted } from "vue";
import { useBookingStore } from "@/stores/booking.store.js";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import axios from "axios";

const bookingStore = useBookingStore();
const router = useRouter();

const bookings = ref([]);
const loading = ref(false);

// Ambil riwayat pemesanan
const getHistory = async () => {
  loading.value = true;
  try {
    const res = await bookingStore.getHistory();
    bookings.value = res;
  } catch (err) {
    console.error(err);
    message.error("Gagal memuat riwayat pemesanan");
  } finally {
    loading.value = false;
  }
};

// Cetak invoice
function printInvoice(bookingId) {
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

// Tombol kembali
function handleBack() {
  router.push("/home");
}

// Ambil data saat mounted
onMounted(() => {
  getHistory();
});
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Riwayat Pemesanan</h2>
      <a-button type="default" @click="handleBack">← Kembali</a-button>
    </div>

    <a-spin :spinning="loading">
      <a-table :data-source="bookings" row-key="id" :pagination="{ pageSize: 5 }">
        <!-- Rute -->
        <a-table-column title="Rute" key="route">
          <template #default="{ record }">
            {{ record.schedule.departure_city }} → {{ record.schedule.destination }}
          </template>
        </a-table-column>

        <!-- Kursi -->
        <a-table-column title="Jumlah Kursi" dataIndex="seats" key="seats" />

        <!-- Total -->
        <a-table-column title="Total" key="total">
          <template #default="{ record }">
            Rp {{ (record.seats * record.schedule.price).toLocaleString('id-ID') }}
          </template>
        </a-table-column>

        <!-- Status -->
        <a-table-column title="Status" key="status">
          <template #default="{ record }">
            <a-tag :color="record.status === 'paid' ? 'green' : 'red'">
              {{ record.status === 'paid' ? 'Selesai' : 'Dibatalkan' }}
            </a-tag>
          </template>
        </a-table-column>

        <!-- Aksi -->
        <a-table-column title="Aksi" key="action">
          <template #default="{ record }">
            <div class="flex space-x-2">
              <a-button 
                v-if="record.status === 'paid'" 
                type="default" 
                size="small" 
                @click="printInvoice(record.id)"
              >
                Cetak Invoice
              </a-button>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
  </div>
</template>
