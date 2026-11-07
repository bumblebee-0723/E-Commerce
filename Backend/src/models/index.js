import sequelize from '../config/database.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';

// Order - OrderItem (One-to-Many)
Order.hasMany(OrderItem, {
  as: 'orderItems',
  foreignKey: 'order_id',
  onDelete: 'CASCADE',
});

OrderItem.belongsTo(Order, {
  as: 'order',
  foreignKey: 'order_id',
});

// Product - OrderItem (One-to-Many)
Product.hasMany(OrderItem, {
  as: 'orderItems',
  foreignKey: 'product_id',
});

OrderItem.belongsTo(Product, {
  as: 'product',
  foreignKey: 'product_id',
});

export {
  sequelize,
  Product,
  Order,
  OrderItem,
};
