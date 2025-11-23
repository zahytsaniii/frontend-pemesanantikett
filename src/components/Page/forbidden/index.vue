<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4"
  >
    <h1 class="text-7xl font-bold text-red-500">403</h1>
    <h2 class="text-2xl font-semibold mt-4">Forbidden</h2>
    <p class="text-gray-600 mt-2 text-center max-w-lg">
      Anda tidak memiliki hak akses untuk membuka halaman ini.
      Silakan kembali atau masuk menggunakan akun yang memiliki izin.
    </p>

    <div class="mt-6 flex gap-3">
      <button
        @click="$router.back()"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Kembali ke Beranda
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth.store.js";

const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isAuthenticated);
</script>
