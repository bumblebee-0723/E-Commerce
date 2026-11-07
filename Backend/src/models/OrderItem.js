import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_price',
    get() {
      const val = this.getDataValue('totalPrice');
      return val !== null && val !== undefined ? parseFloat(val) : 0;
    },
  },
  orderId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'order_id',
  },
}, {
  tableName: 'order_item',
  timestamps: false,
});

export default OrderItem;
