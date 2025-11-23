<script setup>
const props = defineProps({
  open: Boolean,
  record: Object,
});

const emit = defineEmits(["update:open"]);
</script>

<template>
  <a-modal
    :open="props.open"
    title="Detail Keberangkatan"
    @cancel="emit('update:open', false)"
    footer="null"
  >
    <div v-if="props.record">
      <p><strong>Nama Tujuan:</strong> {{ props.record.nama }}</p>
      <p><strong>Tanggal:</strong> {{ props.record.tanggal }}</p>
      <p><strong>Jam:</strong> {{ props.record.jam }}</p>
      <p><strong>Harga:</strong> Rp {{ props.record.harga.toLocaleString("id-ID") }}</p>
    </div>
  </a-modal>
</template>
