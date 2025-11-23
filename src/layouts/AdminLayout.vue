<template>
  <div class="flex min-h-screen bg-gray-100">
    
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Content Slot -->
    <div class="flex-1 ml-64 p-4">
      <slot />
    </div>

  </div>
</template>

<script setup>
import AdminSidebar from "@/components/Layout/AdminSidebar.vue";
</script>
