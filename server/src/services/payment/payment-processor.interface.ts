export interface PaymentProcessor {
  processPayment(order: Order): Promise<PaymentResult>;
}