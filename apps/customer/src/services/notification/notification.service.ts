import api from "@/src/lib/axios";
import type { ApiResponse } from "../types/types";
import type {
  NotificationListResponse,
} from "./notification.types";

export const notificationApi = {
  async getNotifications() {
    const res = await api.get<ApiResponse<NotificationListResponse>>(
      "/notifications"
    );
    return res.data;
  },

  async markAsRead(notificationId: string) {
    const res = await api.patch<ApiResponse<null>>(
      `/notifications/${notificationId}/read`
    );
    return res.data;
  },

  async markAllAsRead() {
    const res = await api.patch<ApiResponse<null>>("/notifications/read-all");
    return res.data;
  },
};
