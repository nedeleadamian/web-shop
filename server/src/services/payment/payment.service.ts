// server/src/services/payment-service.ts
import { Service } from 'typedi';
import { PaymentProcessor } from './payment-processor.interface';
import { StripePaymentProcessor } from './payment-processors/stripe.service';
import { BraintreePaymentProcessor } from './payment-processors/braintree.service';
import { PayPalPaymentProcessor } from './payment-processors/paypal.service';
import { PaymentProcessorEnum } from './payment-processor.enum';


@Service()
export class PaymentService {
  private paymentProcessors: Map<string, PaymentProcessor> = new Map();

  constructor(
    private stripePaymentProcessor: StripePaymentProcessor,
    private braintreePaymentProcessor: BraintreePaymentProcessor,
    private paypalPaymentProcessor: PayPalPaymentProcessor
  ) {
    this.paymentProcessors.set(PaymentProcessorEnum.STRIPE, this.stripePaymentProcessor);
    this.paymentProcessors.set(PaymentProcessorEnum.BRAINTREE, this.braintreePaymentProcessor);
    this.paymentProcessors.set(PaymentProcessorEnum.PAYPAL, this.paypalPaymentProcessor);
  }

  async processPayment(order: Order, paymentProvider: PaymentProcessorEnum): Promise<PaymentResult> {
    const paymentProcessor = this.paymentProcessors.get(paymentProvider);
    if (!paymentProcessor) {
      throw new Error(`Invalid payment provider: ${paymentProvider}`);
    }

    return paymentProcessor.processPayment(order);
  }
}