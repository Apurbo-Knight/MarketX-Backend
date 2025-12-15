const express = require('express');
const {
  makepaymentRequest,
  confirmPayment,
  getOrdersByEmail,
  getOrdersById,
  getAllOrders,
  updateOrderStatus,
  deleteOrderById
} = require('./order.controller');

const router = express.Router();

router.post("/create-checkout-session", makepaymentRequest);
router.post("/confirm-payment", confirmPayment);

router.get("/order/:id", getOrdersById);
router.get("/", getAllOrders); 
router.get("/email/:email", getOrdersByEmail);

router.patch("/update-order-status/:id", updateOrderStatus);
router.delete("/delete-order/:id", deleteOrderById);

module.exports = router;
