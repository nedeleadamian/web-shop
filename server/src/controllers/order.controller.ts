// server/src/controllers/order-controller.ts
import { OrderService } from './order.service';
import { PaymentService } from '../services/payment/payment.service.ts';

import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export const handleUCreateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderData } = req.body;

    const orderServiceInstance = Container.get(UserService);
    const paymentServiceInstance = Container.get(UserService);

    const order = await orderServiceInstance.createOrder(orderData);
    const paymentProvider = orderData.paymentProvider;

    try {
      await paymentServiceInstance.processPayment(order, paymentProvider);
      return  res.status(200).json(order);
    } catch (error) {
      // Handle payment processing errors
      throw new PaymentError(error.message);
    }

  } catch (e) {
    next(e);
  }
};