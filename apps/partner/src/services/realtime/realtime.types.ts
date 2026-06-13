export type PartnerRealtimeEventType =
  | "connection.ready"
  | "booking.created"
  | "booking.updated"
  | "booking.cancelled"
  | "payment.created"
  | "payment.updated"
  | "notification.new"
  | "review.created"
  | "car.changed"
  | "car.status.changed"
  | "branch.changed"
  | "addon.changed"
  | "promotion.changed"
  | "lead.changed"
  | "member.changed"
  | "availability.changed"
  | "support.changed"
  | "tenant.updated";

export type PartnerRealtimeEvent = {
  type: PartnerRealtimeEventType | string;
  tenantId?: string;
  entityId?: string;
  data?: Record<string, unknown>;
  createdAt?: string;
};
