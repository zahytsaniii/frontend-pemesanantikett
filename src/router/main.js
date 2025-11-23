import HomeView from "@/views/home/index.vue";
import AdminView from "@/views/admin/index.vue";
import ForbView from "@/views/forbidden/index.vue";
import CartView from "@/views/cart/cart-view/index.vue";
import PaymentStatus from "@/views/payment-status/index.vue";
import AddCategory from "@/views/add-category/index.vue";
import AddProduct from "@/views/add-product/index.vue";
import UserView from "@/views/user/index.vue";
import UserCreateView from "@/views/user/create.vue";
import UserUpdateView from "@/views/user/update.vue";
import HistoryBook from "@/views/booking-history/index.vue";
import Invoice from "@/views/invoice/index.vue";
import Checkout from "@/views/checkout/index.vue";
import Payment from "@/views/payment/index.vue";
import ManageSchedules  from "@/views/admin-manage-schedules/index.vue";


import ExampleLayout from "@/layouts/ExampleLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

// middleware
import AuthMiddleware from "@/middleware/auth.middleware.js";

export default [
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: {
      title: "Home",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
      role: "user",
    },
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: {
      title: "Admin",
      layout: AdminLayout,
      middleware: [AuthMiddleware],
      role: "admin",
    },
  },
    {
    path: "/manage-schedules",
    name: "manage.schedules",
    component: ManageSchedules,
    meta: {
      title: "Manage Schedules",
      layout: AdminLayout,
      middleware: [AuthMiddleware],
      role: "admin",
    },
  },
  {
    path: "/forbidden",
    name: "forbidden",
    component: ForbView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/checkout/:id",
    name: "checkout",
    component: Checkout,
    meta: {
      title: "Checkout",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
      role: "user",
    },
  },
  {
    path: "/payment/:id",
    name: "payment",
    component: Payment,
    meta: {
      title: "Payment",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/cart-view",
    name: "cart.view",
    component: CartView,
    meta: {
      title: "Cart View",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/payment-status",
    name: "payment.status",
    component: PaymentStatus,
    meta: {
      title: "Payment Status",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/add-category",
    name: "add.category",
    component: AddCategory,
    meta: {
      title: "Add category",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/add-product",
    name: "add.product",
    component: AddProduct,
    meta: {
      title: "Add product",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/user",
    name: "user",
    component: UserView,
    meta: {
      title: "User",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/user/create",
    name: "user.create",
    component: UserCreateView,
    meta: {
      title: "User Create",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
  {
    path: "/user/update",
    name: "user.update",
    component: UserUpdateView,
    meta: {
      title: "User Update",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },

  {
    path: "/history",
    name: "history",
    component: HistoryBook,
    meta: {
      title: "history",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
    {
    path: "/invoice",
    name: "invoice",
    component: Invoice,
    meta: {
      title: "invoice",
      layout: ExampleLayout,
      middleware: [AuthMiddleware],
    },
  },
];
