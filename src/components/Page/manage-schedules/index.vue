<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { message } from "ant-design-vue";

import AddEditScheduleModal from "../../Modal/AddEditScheduleModal.vue";
import DeleteScheduleModal from "../../Modal/DeleteScheduleModal.vue";
import { useTravelScheduleStore } from "@/stores/travelSchedule.store.js";

const store = useTravelScheduleStore();

/* ==========================
   STATE MODAL & FORM
========================== */
const modalAddEdit = ref(false);
const modalDelete = ref(false);
const isEdit = ref(false);
const selectedRecord = ref(null);

/* ==========================
   TABLE COLUMNS
========================== */
const columns = [
  { title: "Nama Tujuan", dataIndex: "destination", key: "destination" },
  { title: "Tanggal Keberangkatan", dataIndex: "tanggal", key: "tanggal" },
  { title: "Jam Keberangkatan", dataIndex: "jam", key: "jam" },
  { title: "Jumlah Kursi", dataIndex: "quota", key: "quota" },
  {
    title: "Harga",
    dataIndex: "price",
    key: "price",
    customRender: ({ text }) => {
      return `Rp ${Number(text).toLocaleString("id-ID")}`;
    },
  },
  { title: "Aksi", key: "action" },
];

/* ==========================
   MAPPING DATA DARI STORE
========================== */
const mappedSchedules = computed(() => {
  if (!Array.isArray(store.schedules)) return [];

  return store.schedules.map((item) => {
    const datetime = item.departure_datetime || "";
    const [tanggal, waktuFull] = datetime.split("T");
    const jam = waktuFull ? waktuFull.substring(0, 5) : "";

    return {
      id: item.id,
      departure_city: item.departure_city || "",
      destination: item.destination || "",
      tanggal: tanggal,
      jam: jam,
      quota: item.quota ?? 1,               
      price: Number(item.price) || 0,       
      category: item.category || "",
    };
  });
});


/* ==========================
   FETCH DATA
========================== */
onMounted(() => {
  store.fetchSchedules();
});

/* ==========================
   MODAL ADD
========================== */
const openAddModal = () => {
  isEdit.value = false;
  selectedRecord.value = {
    id: null,
    destination: "",
    departure_datetime: null,
    quota: 1,
    price: 0,
  };
  modalAddEdit.value = true;
};

/* ==========================
   MODAL EDIT
========================== */
const openEditModal = (record) => {
  isEdit.value = true;
  selectedRecord.value = { ...record };
  modalAddEdit.value = true;
};

/* ==========================
   MODAL DELETE
========================== */
const openDeleteModal = (record) => {
  selectedRecord.value = record;
  modalDelete.value = true;
};

/* ==========================
   SUBMIT DATA (ADD / EDIT)
========================== */
const saveData = async (payload) => {
  if (!payload || !payload.destination) {
    return message.error("Data tidak lengkap");
  }

  const formattedPayload = {
    destination: payload.destination,
    departure_datetime: payload.tanggal && payload.jam
      ? `${payload.tanggal} ${payload.jam}`
      : null,
    quota: payload.quota || 1,
    price: payload.price,
    category: payload.category || "reguler",
  };

  try {
    if (payload.id) {
      await store.updateSchedule(payload.id, formattedPayload);
      message.success("Tujuan berhasil diperbarui");
    } else {
      await store.createSchedule(formattedPayload);
      message.success("Tujuan berhasil ditambahkan");
    }
    modalAddEdit.value = false;
  } catch (err) {
    console.error(err);
    message.error("Terjadi kesalahan saat menyimpan data");
  }
};


/* ==========================
   DELETE DATA
========================== */
const deleteSchedule = async () => {
  try {
    await store.deleteSchedule(selectedRecord.value.id);
    message.success("Tujuan berhasil dihapus");
    modalDelete.value = false;
  } catch (err) {
    console.error(err);
    message.error("Terjadi kesalahan saat menghapus data");
  }
};
</script>

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

  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Kelola Tujuan</h1>
      <a-button type="primary" @click="openAddModal">+ Tambah Tujuan</a-button>
    </div>

    <a-table :columns="columns" :data-source="mappedSchedules" row-key="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="openEditModal(record)">Edit</a-button>
          <a-button type="link" danger @click="openDeleteModal(record)">Hapus</a-button>
        </template>
      </template>
    </a-table>

    <!-- MODALS -->
    <AddEditScheduleModal
      :open="modalAddEdit"
      :isEdit="isEdit"
      :form="selectedRecord"
      @close="modalAddEdit = false"
      @submit="saveData"
    />

    <DeleteScheduleModal
      :open="modalDelete"
      :record="selectedRecord"
      @close="modalDelete = false"
      @delete="deleteSchedule"
    />
  </div>
</template>
