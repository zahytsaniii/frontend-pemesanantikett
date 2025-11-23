# Frontend Pemesanan Tiket

Frontend ini dibuat menggunakan **Vue 3**, **Pinia**, **Ant Design Vue**, dan **Axios** untuk mengelola pemesanan tiket travel.  
Aplikasi ini mendukung fitur CRUD jadwal travel, riwayat pemesanan, form pembayaran, dan autentikasi user.

---

## 🚀 Instalasi

1. Clone repository:

```bash
git clone https://github.com/zahytsaniii/frontend-pemesanantiket.git
Masuk ke folder proyek:

bash
Copy code
cd frontend-pemesanantiket
Install dependencies:

bash
Copy code
npm install
# atau
yarn install
Jalankan development server:

bash
Copy code
npm run dev
# atau
yarn dev
Aplikasi akan berjalan di http://localhost:5173.

🗂 Struktur Folder
pgsql
Copy code
src/
├─ assets/          # File statis (gambar, css, dsb)
├─ components/      # Komponen Vue yang bisa digunakan ulang
├─ pages/           # Halaman utama
├─ stores/          # Pinia store (state management)
├─ router/          # Konfigurasi routing
├─ helper/          # Helper functions (misal axios-wrapper)
└─ App.vue          # Root component
🛠 State Management (Pinia)
TravelScheduleStore
schedules: array jadwal travel

loading: status loading

error: menyimpan error dari request API

Actions:

fetchSchedules(): mengambil semua jadwal travel

createSchedule(data): tambah jadwal

updateSchedule(id, data): update jadwal

deleteSchedule(id): hapus jadwal

BookingStore
bookings: riwayat pemesanan

Actions:

fetchBookings(): mengambil data riwayat booking

getBookingById(id): detail pemesanan

🌐 API Interaction (Axios Wrapper)
Semua request API menggunakan axiosWrapper:

js
Copy code
import { axiosWrapper } from "@/helper/axios-wrapper";

axiosWrapper.get("/admin/schedules");       // GET
axiosWrapper.post("/admin/schedules", data); // POST
axiosWrapper.put("/admin/schedules/1", data); // PUT
axiosWrapper.delete("/admin/schedules/1");  // DELETE
Otomatis menyertakan token autentikasi jika ada

Bisa menampilkan notifikasi sukses/error

🖥 Pages & Fitur
Halaman	Fitur Utama
Jadwal Travel	Menampilkan tabel jadwal, tambah/edit/hapus jadwal, pagination, sorting, modal tambah/edit data dengan validasi
Riwayat Pemesanan	Menampilkan riwayat booking user, tombol detail, cetak invoice, loading state saat fetch API
Form Pembayaran	Update status pembayaran via API, toast notifikasi sukses/error
Login / Logout	Autentikasi user, token disimpan di Pinia

🔄 Alur Penggunaan
User login → token disimpan di Pinia

User buka halaman jadwal → fetch data jadwal travel

User pilih jadwal → submit booking → API POST

User cek riwayat → fetch data booking

User lakukan pembayaran → update status pembayaran

🧩 Environment Variables
Buat file .env di root project:

bash
Copy code
VITE_API_BASE_URL=http://localhost:8000/api
💡 Catatan Teknis
Modal Add/Edit/Delete menggunakan binding reactive (ref / reactive)

Semua action di Pinia sudah async/await dengan try/catch

Pesan error menggunakan Ant Design Vue message.error

Struktur kode modular dan terpisah antara pages, components, stores, dan helpers

📸 Screenshot (Opsional)