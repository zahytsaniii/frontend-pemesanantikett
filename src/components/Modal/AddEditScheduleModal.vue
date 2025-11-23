<template>
  <a-modal
    :open="open"
    :title="isEdit ? 'Edit Tujuan' : 'Tambah Tujuan'"
    @cancel="onClose"
    @ok="onSubmit"
    ok-text="Simpan"
    cancel-text="Batal"
    destroy-on-close
  >
    <a-form layout="vertical" @submit.prevent="onSubmit">
      <a-form-item label="Kategori" required>
        <a-select 
          v-model:value="localForm.category"
          :options="optionsCategory" 
          placeholder="Pilih kategori" 
          />
      </a-form-item>
      
      <a-form-item label="Nama Tujuan" required>
        <a-input v-model:value="localForm.destination" placeholder="Masukkan nama tujuan" />
      </a-form-item>

      <a-form-item label="Tanggal Keberangkatan" required>
        <a-date-picker
          v-model:value="localForm.tanggal"
          class="w-full"
          placeholder="Pilih tanggal"
        />
      </a-form-item>

      <a-form-item label="Jam Keberangkatan" required>
        <a-time-picker
          v-model:value="localForm.jam"
          format="HH:mm"
          class="w-full"
          placeholder="Pilih jam"
        />
      </a-form-item>

      <a-form-item label="Jumlah Kursi" required>
        <a-input-number
          v-model:value="localForm.quota"
          :min="1"
          class="w-full"
          placeholder="Jumlah kursi"
        />
      </a-form-item>

      <a-form-item label="Harga" required>
        <a-input-number
          v-model:value="localForm.price"
          :min="0"
          class="w-full"
          placeholder="Harga tiket"
        />
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { useTravelScheduleStore } from "@/stores/travelSchedule.store.js";

const store = useTravelScheduleStore();

const props = defineProps({
  open: Boolean,
  isEdit: Boolean,
  form: Object,
});

const emit = defineEmits(["close", "submit"]);

const localForm = ref({});
const optionsCategory = [
  { label: "Reguler", value: "reguler" },
  { label: "VIP", value: "vip" },
];  

watch(
  () => props.form,
  (v) => {
    if (!v) {
      localForm.value = {
        id: null,
        destination: "",
        tanggal: null,
        jam: null,
        quota: null,
        price: null,
        category: null
      };
      return;
    }

    localForm.value = {
      ...v,
      tanggal: v.tanggal ? dayjs(v.tanggal) : null,
      jam: v.jam ? dayjs(v.jam, "HH:mm") : null,
    };
  },
  { immediate: true }
);

// close modal
const onClose = () => emit("close");

// submit modal
const onSubmit = () => {
  if (!localForm.value.destination) {
    return message.error("Nama tujuan wajib diisi");
  }

  emit("submit", {
    id: localForm.value.id,
    destination: localForm.value.destination,
    tanggal: localForm.value.tanggal?.format("YYYY-MM-DD"),
    jam: localForm.value.jam?.format("HH:mm"),
    quota: localForm.value.quota,
    price: localForm.value.price,
    category: localForm.value.category || "reguler",
  });

  emit("close");
};
</script>
