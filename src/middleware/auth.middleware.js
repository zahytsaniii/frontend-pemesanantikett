import { useAuthStore } from "@/stores/auth.store.js";
import { useSegmentStore } from "@/stores/segment.store.js";

export default function AuthMiddleware({ to, next }) {
  const auth = useAuthStore();
  const segment = useSegmentStore();

  // Set segment (opsional)
  segment.setSegment(to.meta.group ?? to.fullPath);

  // Jika user belum login → redirect
  if (!auth.user) {
    auth.returnUrl = to.fullPath;
    return next({ name: "login" });
  }

  // Jika route butuh role tertentu
  if (to.meta.role && auth.user.role !== to.meta.role) {
    return next({ name: "forbidden" });
  }

  return next();
}
