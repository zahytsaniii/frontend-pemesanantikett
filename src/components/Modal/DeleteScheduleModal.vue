<template>
  <a-modal
    :open="open"
    title="Hapus Tujuan"
    ok-text="Hapus"
    cancel-text="Batal"
    @cancel="onClose"
    @ok="onDelete"
    :ok-button-props="{ danger: true }"
  >
    <p>Apakah Anda yakin ingin menghapus tujuan <b>{{ record?.nama }}</b>?</p>
  </a-modal>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  record: Object,
});

const emit = defineEmits(["close", "delete"]);

const onClose = () => emit("close");
const onDelete = () => emit("delete", props.record);
</script>
