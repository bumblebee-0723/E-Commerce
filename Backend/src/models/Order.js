import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'order_id',
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'customer_name',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'PLACED',
  },
  orderDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'order_date',
  },
}, {
  tableName: 'orders',
  timestamps: false,
});

export default Order;
