import express from "express";
const router = express.Router();
import {authentication , AuthorizedAdmin} from '..//middlewares/authMiddleware.js'
import { calculateTotalSale, calculateTotalSaleByDate, countTotalOrder, createOrder, getAllOrders,getOrderById,getUserOrder, markOrderAsDeliver, approveOrder, cancelOrder } from "../controllers/orderControllers.js";

router.route('/').post(authentication , createOrder)
.get(authentication , AuthorizedAdmin , getAllOrders)

router.route('/mine').get(authentication, getUserOrder);
router.route('/total-order').get(countTotalOrder);
router.route('/total-sale').get(calculateTotalSale);
router.route('/total-sale-date').get(calculateTotalSaleByDate);
router.route('/:id').get(authentication , getOrderById)
router.route('/:id/approve').put(authentication , AuthorizedAdmin, approveOrder)
router.route('/:id/deliver').put(authentication , AuthorizedAdmin , markOrderAsDeliver)
router.route('/:id/cancel').put(authentication , cancelOrder)
export default router;