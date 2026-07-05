// src/services/payments/payments.types.ts
export type PaymentMethod = "promptpay" | "bank_transfer";

export type Payment = {
  id: string;
  bookingId: string;
  method: PaymentMethod;
  status: "pending" | "pending_verification" | "paid" | "failed" | "refunded";
  amount: number;
  transactionId?: string;
  processor?: string;
  processedAt?: string;
  failureReason?: string;
  paymentUrl?: string;
  qrCodeUrl?: string;
  slipUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatePaymentPayload = {
  bookingId: string;
  method: PaymentMethod;
  slipImage?: string;
};
