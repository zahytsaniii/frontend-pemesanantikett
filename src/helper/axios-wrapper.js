import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "vue3-toastify";

export const axiosWrapper = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
};

function request(method) {
  return (url, body = null, notification = false, contentType = "application/json") => {
    
    const headers = authHeader(url);

    const options = {
      method,
      url,
      headers,
    };

    // Khusus GET → gunakan params, bukan body
    if (method === "GET" && body) {
      options.params = body;
    }

    // Selain GET → kirim data biasa
    if (method !== "GET" && body) {
      if (contentType === "multipart/form-data") {
        options.headers["Content-Type"] = "multipart/form-data";
        options.data = body;
      } else {
        options.headers["Content-Type"] = "application/json";
        options.data = body;
      }
    }

    return axios(options)
      .then((response) => {
        if (notification && response.data?.message) {
          toast.success(response.data.message);
        }
        return response;
      })
      .catch((error) => errorHandler(error));
  };
}

function authHeader(url) {
  const auth = useAuthStore();
  const token = auth.token;
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  if (token && url.startsWith(apiBase)) {
    return { Authorization: `Bearer ${token}` };
  }

  return {};
}

function errorHandler(error) {
  let msg = "Terjadi kesalahan";

  if (error.response) {
    const status = error.response.status;

    if (status === 401) {
      useAuthStore().logout();
      msg = "Sesi telah habis, silakan login ulang.";
    }

    else if (status === 403) {
      msg = error.response.data?.message || "Akses ditolak.";
    }

    else if (status === 422) {
      const errors = error.response.data.errors;
      msg = Object.values(errors).flat().join(", ");
    }

    else {
      msg = error.response.data?.message || msg;
    }
  }

  toast.error(msg);
  return Promise.reject(error);
}
