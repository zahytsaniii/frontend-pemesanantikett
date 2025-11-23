<template>
  <!-- HEADER -->
  <div class="flex justify-between items-center bg-white rounded-2xl shadow p-4 mb-6">
    <h1 class="text-2xl font-bold text-blue-600">Admin Panel</h1>

    <div class="flex items-center gap-2">
      <a-dropdown trigger="click">
        <a-avatar
          size="large"
          class="cursor-pointer"
          src="https://api.dicebear.com/9.x/adventurer/svg?seed=administrator"
        />
        <template #overlay>
          <a-menu>
            <a-menu-item @click="handleLogout">Logout</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>

  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">
      Laporan Jumlah Penumpang per Jadwal Travel
    </h2>

    <!-- TABLE UTAMA -->
    <a-table
      :columns="columns"
      :data-source="travelList"
      bordered
      row-key="id"
      :loading="loading"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          {{ record.name }}
        </template>

        <template v-if="column.dataIndex === 'departure_date'">
          {{ record.departure_date }}
        </template>

        <template v-if="column.dataIndex === 'quota'">
          {{ record.quota }} orang
        </template>

        <template v-if="column.dataIndex === 'booked_count'">
          <a-tag color="blue">
            {{ record.booked_count }} / {{ record.quota }}
          </a-tag>
        </template>

        <template v-if="column.key === 'action'">
          <a-button type="primary" @click="openDetail(record)">
            Detail
          </a-button>
        </template>
      </template>
    </a-table>

    <!-- MODAL DETAIL -->
    <a-modal
      v-model:open="showModal"
      :title="modalTitle"
      width="650px"
      :footer="null"
    >
      <a-table
        :columns="detailColumns"
        :data-source="passengerList"
        bordered
        size="small"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            {{ record.name }}
          </template>

          <template v-if="column.dataIndex === 'phone'">
            {{ record.phone }}
          </template>

          <template v-if="column.dataIndex === 'seat'">
            {{ record.seat }} kursi
          </template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAdminReportStore } from "@/stores/adminReport.store.js";
import { useAuthStore } from "@/stores/auth.store.js";

const reportStore = useAdminReportStore();

// State
const travelList = ref([]);
const passengerList = ref([]);
const showModal = ref(false);
const modalTitle = ref("");
const loading = ref(false);

// ====================================
// Kolom table utama
// ====================================
const columns = [
  { title: "Nama Jadwal", dataIndex: "name" },
  { title: "Tanggal Keberangkatan", dataIndex: "departure_date" },
  { title: "Kuota Awal", dataIndex: "quota" },
  { title: "Terisi", dataIndex: "booked_count" },
  { title: "Aksi", key: "action" },
];

// ====================================
// Kolom detail
// ====================================
const detailColumns = [
  { title: "Nama Penumpang", dataIndex: "name" },
  { title: "Email", dataIndex: "phone" },
  { title: "Jumlah Kursi", dataIndex: "seat" },
];

// ====================================
// Ambil data laporan & hitung kuota awal + kursi terisi
// ====================================
onMounted(async () => {
  loading.value = true;
  try {
    const schedules = await reportStore.getAllReports();

    const detailPromises = schedules.map(item =>
      reportStore.getPassengerDetail(item.id)
        .then(detail => {
          const seatsBooked = detail.reduce((sum, b) => sum + (b.seats || 0), 0);
          return {
            id: item.id,
            name: `${item.departure_city} → ${item.destination}`,
            departure_date: new Date(item.departure_datetime).toLocaleString("id-ID"),
            quota: item.quota + seatsBooked,  
            booked_count: seatsBooked,        
          };
        })
    );

    // Tunggu semua promise selesai
    travelList.value = await Promise.all(detailPromises);

  } catch (err) {
    console.error("Gagal mengambil laporan:", err);
  } finally {
    loading.value = false;
  }
});

// ====================================
// Detail modal
// ====================================
async function openDetail(record) {
  modalTitle.value = `${record.name} • ${record.departure_date}`;

  const data = await reportStore.getPassengerDetail(record.id);

  passengerList.value = data.map(item => ({
    id: item.id,
    name: item.user?.name || "-",
    phone: item.user?.email || "-",
    seat: item.seats,
  }));

  showModal.value = true;
}

// ====================================
// Logout
// ====================================
const authStore = useAuthStore();
const handleLogout = () => {
  authStore.logout();
};
</script>
