<script setup>
import { ref, computed, onMounted } from "vue";
import { useBookingStore } from "@/stores/booking.store.js";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";

const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
};

const goToHistory = () => {
  router.push("/history")
}

const bookingStore = useBookingStore();
const router = useRouter();

/* --------------------------------------------------------
|  FILTER STATE
-------------------------------------------------------- */
const selectedCategory = ref("all");
const searchDestination = ref("");
const selectedDate = ref(null);
const passengerCount = ref(null); // null = tidak wajib filter kuota

/* --------------------------------------------------------
|  STORE DATA
-------------------------------------------------------- */
const isLoading = computed(() => bookingStore.loading);
const schedules = computed(() => bookingStore.schedules || []);

/* --------------------------------------------------------
|  LOAD DATA AWAL
-------------------------------------------------------- */
onMounted(() => {
  bookingStore.getSchedules();
});

/* --------------------------------------------------------
|  LOCAL FILTER (kategori)
-------------------------------------------------------- */
const filterSchedules = computed(() => {
  return schedules.value.filter((item) => {
    return (
      selectedCategory.value === "all" ||
      item.category === selectedCategory.value
    );
  });
});

/* --------------------------------------------------------
|  ACTION: SEARCH ROUTES
-------------------------------------------------------- */
const searchRoutes = async () => {
  await bookingStore.getSchedules({
    category: selectedCategory.value === "all" ? null : selectedCategory.value,
    destination: searchDestination.value || null,
    date: selectedDate.value ? selectedDate.value.format("YYYY-MM-DD") : null,
    quota: passengerCount.value || null,
  });
};

/* --------------------------------------------------------
|  ACTION: BOOK TICKET
-------------------------------------------------------- */
const checkoutTicket = async () => {
  const qty = Number(seatQty.value);
  const quota = Number(selectedRoute.value?.quota ?? 0);

  if (!qty || qty <= 0) return message.error("Jumlah kursi tidak valid");
  if (qty > quota)
    return message.error(`Jumlah kursi melebihi sisa kuota! Sisa: ${quota}`);

  try {
    const order = await bookingStore.bookTicket({
      travel_schedule_id: selectedRoute.value.id,
      seats: qty,
    });

    if (!order?.id) {
      return message.error("Gagal memesan tiket, coba lagi.");
    }

    message.success("Tiket berhasil dipesan!");
    showSeatModal.value = false;

    // refresh jadwal supaya kuota terbaru muncul
    await bookingStore.getSchedules();

    // redirect ke halaman checkout
    router.push(`/checkout/${order.id}`);
  } catch (err) {
    // tangani error dari API
    const msg = err.response?.data?.message || "Gagal memesan tiket";
    message.error(msg);
  }
};

/* --------------------------------------------------------
|  MODAL STATE
-------------------------------------------------------- */
const showSeatModal = ref(false);
const selectedRoute = ref(null);
const seatQty = ref(1);

const openSeatModal = (route) => {
  selectedRoute.value = route;
  seatQty.value = 1; // reset qty
  showSeatModal.value = true;
};
const handleQtyChange = (value) => {
  const max = Number(selectedRoute.value.quota);

  if (value > max) {
    seatQty.value = null; // reset
    return message.error(`Jumlah kursi melebihi sisa kuota (${max}).`);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- HEADER -->
    <div
      class="bg-white shadow rounded-2xl p-4 flex justify-between items-center mb-6"
    >
      <h1 class="text-2xl font-bold text-blue-600">
        TransKlaten – Pemesanan Tiket
      </h1>

      <a-dropdown trigger="click">
        <a-avatar
          size="large"
          class="cursor-pointer"
          src="https://api.dicebear.com/9.x/adventurer/svg?seed=user"
        />
        <template #overlay>
          <a-menu>
            <a-menu-item key="history" @click="goToHistory"> Riwayat Pemesanan</a-menu-item>
            <a-menu-item @click="logout">Logout</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <!-- FILTER PANEL -->
    <div
      class="bg-white shadow rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center"
    >
      <!-- CATEGORY -->
      <a-select
        v-model:value="selectedCategory"
        class="w-full sm:w-60"
        placeholder="Kategori"
        :options="[
          { label: 'Semua', value: 'all' },
          { label: 'Reguler', value: 'reguler' },
          { label: 'VIP', value: 'vip' },
        ]"
      />

      <!-- DESTINATION -->
      <a-input-search
        v-model:value="searchDestination"
        placeholder="Cari tujuan..."
        allow-clear
        class="w-full sm:w-60"
      />

      <!-- DATE -->
      <a-date-picker
        v-model:value="selectedDate"
        placeholder="Pilih tanggal"
        class="w-full sm:w-52"
      />

      <!-- PASSENGERS -->
      <a-input-number
        v-model:value="passengerCount"
        :min="1"
        placeholder="Jumlah Penumpang"
        class="w-full sm:w-40"
      />

      <!-- SEARCH BUTTON -->
      <a-button type="primary" class="w-full sm:w-auto" @click="searchRoutes">
        Cari Rute
      </a-button>
    </div>

    <!-- LOADING -->
    <div v-if="isLoading" class="text-center py-10">Loading data...</div>

    <!-- SCHEDULE LIST -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in filterSchedules"
        :key="item.id"
        class="bg-white rounded-xl shadow hover:shadow-lg transition p-4 border"
      >
        <!-- CATEGORY BADGE + QUOTA -->
        <div class="flex justify-between items-center mb-2">
          <span
            class="px-3 py-1 rounded-full text-xs"
            :class="{
              'bg-blue-100 text-blue-600': item.category === 'reguler',
              'bg-green-100 text-green-600': item.category === 'vip',
            }"
          >
            {{ item.category?.toUpperCase() || "KLATEN" }}
          </span>

          <span class="text-gray-500 text-sm">
            Sisa {{ item.quota }} Kursi
          </span>
        </div>

        <!-- ROUTE INFO -->
        <p class="font-bold text-lg">
          {{ item.departure_city }} → {{ item.destination }}
        </p>

        <p class="text-gray-600 text-sm mb-3">
          Tanggal :
          {{
            new Date(item.departure_datetime).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          }}
        </p>

        <p class="text-gray-600 text-sm mb-3">
          Berangkat :
          {{
            new Date(item.departure_datetime).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          }}
        </p>

        <!-- PRICE + BUTTON -->
        <div class="flex justify-between items-end mt-4">
          <p class="text-blue-600 font-bold text-xl">
            Rp {{ item.price.toLocaleString("id-ID") }}
          </p>

          <a-button
            type="primary"
            :disabled="item.quota === 0"
            @click="openSeatModal(item)"
          >
            {{ item.quota === 0 ? "Habis" : "Pesan Tiket" }}
          </a-button>
        </div>
      </div>
    </div>

    <!-- MODAL PILIH JUMLAH KURSI -->
    <a-modal
      v-model:open="showSeatModal"
      centered
      title="Pilih Jumlah Kursi"
      :footer="null"
    >
      <div v-if="selectedRoute" class="space-y-3">
        <!-- Rute -->
        <div class="border-b pb-2">
          <p class="font-bold text-lg text-blue-600">
            {{ selectedRoute.departure_city }} → {{ selectedRoute.destination }}
          </p>
          <p class="text-gray-600 text-sm">
            {{
              new Date(selectedRoute.departure_datetime).toLocaleDateString(
                "id-ID",
                { day: "2-digit", month: "long", year: "numeric" }
              )
            }}
            •
            {{
              new Date(selectedRoute.departure_datetime).toLocaleTimeString(
                "id-ID",
                { hour: "2-digit", minute: "2-digit", hour12: false }
              )
            }}
          </p>

          <p class="text-gray-500 text-xs">
            Sisa kursi: {{ selectedRoute.quota }}
          </p>
        </div>

        <!-- Input jumlah kursi -->
        <div>
          <label class="text-sm text-gray-600">Jumlah kursi</label>
          <a-input-number
            v-model:value="seatQty"
            :min="1"
            class="mt-1 w-full"
            @change="handleQtyChange"
          />
        </div>

        <!-- tombol checkout -->
        <a-button
          type="primary"
          block
          class="mt-3"
          size="large"
          @click="checkoutTicket"
        >
          Bayar
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
img {
  transition: 0.3s ease;
}
img:hover {
  transform: scale(1.03);
}
</style>
