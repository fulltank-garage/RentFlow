// src/services/payments/payments.types.ts
export type PaymentMethod = "card" | "promptpay" | "bank_transfer" | "cash";

export type Payment = {
  id: string;
  bookingId: string;
  method: PaymentMethod;
  status: "pending" | "paid" | "failed" | "refunded";
  amount: number;
  transactionId?: string;
  processor?: string;
  cardLast4?: string;
  cardHolder?: string;
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
  cardHolder?: string;
  cardNumber?: string;
  cardExpiry?: string;
};
