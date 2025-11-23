<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <AddCategory/>
  </div>
</template>

<script setup >
import { ref } from 'vue'
import AddCategory from "@/components/Page/add-category/index.vue";
import { message } from 'ant-design-vue'


</script>

<style scoped>
.ant-card {
  border: none;
}
</style>
