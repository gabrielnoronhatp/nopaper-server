import { Router } from 'express';
import OrderController from '../controller/OrderController';
import OrderService from '../service/OrderService';
import Order from '../models/Order';
import { pgPool } from '../config/database';

const router = Router();
const orderModel = new Order(pgPool);
const orderService = new OrderService(orderModel);
const orderController = new OrderController(orderService);

router.post('/orders', (req, res) => orderController.createOrder(req, res));

export default router;
