<script setup>
import { ref,onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/category.store.js'

const categoryStore = useCategoryStore()
const router = useRouter()
const category = ref('')
const isSubmitting = ref(false)

onMounted(async () => {
  if (!categoryStore.categories?.length && categoryStore.fetchAll) {
    await categoryStore.fetchAll()
  }
})
const handleSubmit = async () => {
  const newCategory = category.value.trim()

  if (!newCategory) {
    message.warning('Nama kategori tidak boleh kosong')
    return
  }

  const isExist = categoryStore.categories.some(
    (c) => c.name.toLowerCase() === newCategory.toLowerCase()
  )

  if (isExist) {
    message.error(`Kategori "${newCategory}" sudah ada!`)
    return
  }

  isSubmitting.value = true
  try {
    await categoryStore.create({ name: newCategory })
    message.success(`Kategori "${newCategory}" berhasil ditambahkan!`)
    category.value = ''
    router.push('/')
  } catch (err) {
    message.error('Gagal menambah kategori!')
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  message.info('Batal menambah kategori')
  category.value = ''
  router.push('/')
}
</script>
<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <a-card class="w-[400px] rounded-2xl shadow-md">
      <div class="flex flex-col space-y-4">
        <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">
          Tambah Kategori
        </h2>

        <a-form layout="vertical" @submit.prevent="handleSubmit">
          <a-form-item name="category" label="Kategori" :rules="[{ required: true, message: 'Please input your category!' }]">
            <a-input
              v-model:value="category"
              placeholder="Kategori"
              allow-clear
            />
          </a-form-item>

          <div class="flex justify-start w-full space-x-3 pt-4">
            <a-button
              class="border-blue-500 text-blue-500 hover:bg-blue-50 w-full rounded-lg"
              @click="handleCancel"
            >
              Batal
            </a-button>
            <a-button
              type="primary"
              class="bg-blue-600 hover:bg-blue-700 w-full rounded-lg"
              :loading="isSubmitting"
              @click="handleSubmit"
            >
              Tambah
            </a-button>
          </div>
        </a-form>
      </div>
    </a-card>
  </div>
</template>



<style scoped>
.ant-card {
  border: none;
}
</style>
