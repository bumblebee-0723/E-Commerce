import crypto from 'crypto';
import { sequelize, Order, OrderItem, Product } from '../models/index.js';

/**
 * Generates an 8-character unique order ID prefix with "ORD", matching:
 * "ORD" + UUID.randomUUID().toString().substring(0,8).toUpperCase()
 */
function generateOrderId() {
  const randomHex = crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();
  return `ORD${randomHex}`;
}

export async function placeOrder(orderRequest) {
  const { customerName, email, items } = orderRequest;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  const transaction = await sequelize.transaction();

  try {
    const orderId = generateOrderId();
    const orderDate = new Date().toISOString().split('T')[0];

    const order = await Order.create({
      orderId,
      customerName,
      email,
      status: 'PLACED',
      orderDate,
    }, { transaction });

    const orderItemResponses = [];

    for (const itemRequest of items) {
      const product = await Product.findByPk(itemRequest.productId, { transaction });
      if (!product) {
        throw new Error(`Product not found with id: ${itemRequest.productId}`);
      }

      const requestedQuantity = parseInt(itemRequest.quantity, 10) || 1;
      const productPrice = parseFloat(product.price) || 0;
      const itemTotalPrice = parseFloat((productPrice * requestedQuantity).toFixed(2));

      // Decrement stock quantity
      product.stockQuantity = product.stockQuantity - requestedQuantity;
      await product.save({ transaction });

      // Create OrderItem
      await OrderItem.create({
        productId: product.id,
        quantity: requestedQuantity,
        totalPrice: itemTotalPrice,
        orderId: order.id,
      }, { transaction });

      orderItemResponses.push({
        productName: product.name,
        quantity: requestedQuantity,
        totalPrice: itemTotalPrice,
      });
    }

    await transaction.commit();

    return {
      orderId: order.orderId,
      customerName: order.customerName,
      email: order.email,
      status: order.status,
      orderDate: order.orderDate,
      items: orderItemResponses,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function getAllOrderResponses() {
  const orders = await Order.findAll({
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price'],
          },
        ],
      },
    ],
    order: [['id', 'DESC']],
  });

  return orders.map((order) => {
    const itemResponses = (order.orderItems || []).map((item) => ({
      productName: item.product ? item.product.name : 'Unknown Product',
      quantity: item.quantity,
      totalPrice: parseFloat(item.totalPrice),
    }));

    return {
      orderId: order.orderId,
      customerName: order.customerName,
      email: order.email,
      status: order.status,
      orderDate: order.orderDate,
      items: itemResponses,
    };
  });
}
