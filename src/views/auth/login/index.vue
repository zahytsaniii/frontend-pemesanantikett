<template>
  <div class="flex h-screen bg-gray-100">
    <div
      class="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 rounded-3xl shadow-lg m-6 overflow-hidden"
    >
      <img
        src="@/assets/image/bus.jpeg"
        alt="Login Image"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="w-full md:w-1/2 flex flex-col justify-start px-10">
      <!-- <div class="w-full flex justify-end mb-16 mt-6">
        <img
          src="@/assets/image/MASPOS.png"
          alt="Logo MASPOS"
          class="w-30 h-auto object-contain"
        />
      </div> -->
      <div class="mx-auto w-full mt-64">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          Selamat Datang di <span class="text-blue-600">TransKlaten</span>
        </h1>
        <p class="text-gray-600 mb-8 w-full">
          Kelola perjalanan Anda dengan mudah. TransKlaten memudahkan pemesanan tiket travel kapan saja, di mana saja.
        </p>

        <a-form
          layout="vertical"
          @submit.prevent="login"
          ref="loginForm"
          :model="formData"
        >
          <a-form-item
            name="email"
            label="Email"
            :rules="[{ required: true, message: 'Please input your Email!' }]"
          >
            <a-input
              v-model:value="formData.email"
              size="large"
              placeholder="Email"
            />
          </a-form-item>
          <a-form-item
            name="password"
            label="Password"
            :rules="[
              { required: true, message: 'Please input your Password!' },
            ]"
          >
            <a-input-password
              v-model:value="formData.password"
              size="large"
              placeholder="Password"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              block
              html-type="submit"
              size="large"
              class="mt-2"
              :loading="loading"
            >
              Masuk
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store.js";
import { message } from "ant-design-vue";

const authStore = useAuthStore();
const loading = ref(false);
const loginForm = ref(null);

const formData = ref({
  email: "",
  password: "",
});

const login = async () => {
  try {
    loading.value = true;
    await authStore.login(formData.value);
  } catch (error) {
    message.error("Gagal login, periksa email atau password!");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 10px;
}
</style>
