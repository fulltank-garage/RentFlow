export type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type NotificationListResponse = {
  items: Notification[];
  total: number;
};
