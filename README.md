# 🚌 Travel Booking Frontend - Vue Js

Frontend ini dibuat menggunakan **Vue 3**, **Pinia**, **Ant Design Vue**, dan **Axios** untuk mengelola pemesanan tiket travel.  
Aplikasi ini mendukung fitur CRUD jadwal travel, riwayat pemesanan, form pembayaran, dan autentikasi user.

---

# 🚀 Instalasi & Setup

## 1. Clone Repository
	git clone https://github.com/zahytsaniii/frontend-pemesanantiket.git
	cd frontend-pemesanantiket

## 2. Install Dependencies
	npm install

## 3. Copy Environment File
	cp .env.example .env

## 4. Konfigurasi `.env`
	VITE_API_BASE_URL=http://localhost:8000/api
	  atau
	VITE_API_BASE_URL=http://127.0.0.1:8000/api

## 5. Jalankan aplikasi:
	npm run dev

## Aplikasi akan berjalan di http://localhost:5173.

# 🗂 Struktur Folder
	src/
	├─ assets/          # File statis (gambar, css, dsb)
	├─ components/      # Komponen Vue yang bisa digunakan ulang
	├─ pages/           # Halaman utama
	├─ stores/          # Pinia store (state management)
	├─ router/          # Konfigurasi routing
	├─ helper/          # Helper functions (misal axios-wrapper)
	└─ App.vue          # Root component

# 🛠 State Management (Pinia)

## 1. TravelScheduleStore
	schedules: array jadwal travel
	loading: status loading
	error: menyimpan error dari request API
### Actions:
	fetchSchedules(): mengambil semua jadwal travel
	createSchedule(data): tambah jadwal
	updateSchedule(id, data): update jadwal
	deleteSchedule(id): hapus jadwal

## 2. BookingStore
	bookings: riwayat pemesanan

### Actions:
	fetchBookings(): mengambil data riwayat booking
	getBookingById(id): detail pemesanan

#🌐 API Interaction (Axios Wrapper)
###Semua request API menggunakan axiosWrapper:
	import { axiosWrapper } from "@/helper/axios-wrapper";
	axiosWrapper.get("/admin/schedules");       // GET
	axiosWrapper.post("/admin/schedules", data); // POST
	axiosWrapper.put("/admin/schedules/1", data); // PUT
	axiosWrapper.delete("/admin/schedules/1");  // DELETE
### Otomatis menyertakan token autentikasi jika ada
### Bisa menampilkan notifikasi sukses/error

#🖥 Pages & Fitur
## Halaman Fitur Utama
### Jadwal Travel (Admin)	
	Menampilkan tabel jadwal 
	Tambah/edit/hapus jadwal 
	Pagination 
	Sorting 
	Modal tambah/edit data dengan validasi
### Jadwal Travel dan Pemesanan (User)
	Menampilkan daftar jadwal
	Melakukan pemesanan
	Menyelesaikan pesanan
### Riwayat Pemesanan	
	Menampilkan riwayat booking user 
	Tombol detail 
	Cetak invoice 
### Form Pembayaran	
	Update status pembayaran via API 
	Toast notifikasi sukses/error

### Login / Logout	
	Autentikasi user, token disimpan di Pinia

# 🔄 Alur Penggunaan
### 1. User login → token disimpan di Pinia
### 2. User buka halaman jadwal → fetch data jadwal travel
### 3. User pilih jadwal → submit booking → API POST
### 4. User cek riwayat → fetch data booking
### 5. User lakukan pembayaran → update status pembayaran


# 💡 Catatan Teknis
### Modal Add/Edit/Delete menggunakan binding reactive (ref / reactive)
### Semua action di Pinia sudah async/await dengan try/catch
### Pesan error menggunakan Ant Design Vue message.error
### Struktur kode modular dan terpisah antara pages, components, stores, dan helpers

# 📸 Screenshot 
### 1. Tampilan Login
![Halaman Login](./assets/login.png)
### 2. Dashboard Admin
![Halaman Admin](./assets/dashboard-admin.png)
### 3. Manajemen Tiket
![Halaman Manajemen](./assets/schedule-management.png)
### 4. Dashboard User
![Halaman User](./assets/dashboard-user.png)
![Halaman User2](./assets/dashboard-user2.png)
### 5. Menu Pesan Tiket
![Halaman Pesan](\src\assets\documentation\book-ticket.png)
### 6. Menu Review
![Halaman Review](./assets/review-page.png)
### 7. Menu Pembayaran
![Halaman Pembayaran](./assets/payment-confirmation.png)
### 8. Pembayaran Sukses
![Halaman Sukses](./assets/payment-success.png)
### 9. Invoice
![Halaman Invoice](./assets/invoice.png)
### 10. History
![Halaman History](./assets/history.png)