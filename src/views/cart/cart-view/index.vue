<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <CartView />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CartView from "@/components/Page/cart-view/index.vue";


</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0 8px;
}
</style>
