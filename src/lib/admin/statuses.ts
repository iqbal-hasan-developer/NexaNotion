import type { MessageStatus, OrderStatus, PaymentStatus } from "@/types";

export const orderStatuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
export const paymentStatuses: PaymentStatus[] = ["unpaid", "pending", "verified", "failed", "refunded"];
export const messageStatuses: MessageStatus[] = ["new", "read", "replied", "archived"];

export function isOrderStatus(value: string): value is OrderStatus {
  return orderStatuses.includes(value as OrderStatus);
}

export function isPaymentStatus(value: string): value is PaymentStatus {
  return paymentStatuses.includes(value as PaymentStatus);
}

export function isMessageStatus(value: string): value is MessageStatus {
  return messageStatuses.includes(value as MessageStatus);
}
