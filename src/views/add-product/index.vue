<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <AddProduct/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AddProduct from "@/components/Page/add-product/index.vue";
import { message } from 'ant-design-vue'


</script>

<style scoped>
.ant-card {
  border: none;
}
</style>
