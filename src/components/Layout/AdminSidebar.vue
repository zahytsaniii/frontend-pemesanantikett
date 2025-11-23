<template>
  <aside class="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 p-4">
    <h2 class="text-xl font-bold mb-6">Admin Panel</h2>

    <!-- Master Data Section -->

    <div class="mb-4">
      <nav class="flex flex-col space-y-1">
        <button
          @click="goTo('/admin')"
          class="text-left px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          Report
        </button>

        <button
          @click="goTo('/manage-schedules')"
          class="text-left px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          Tujuan
        </button>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goTo = (path) => router.push(path);
</script>
