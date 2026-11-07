import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    get() {
      const val = this.getDataValue('price');
      return val !== null && val !== undefined ? parseFloat(val) : 0;
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  releaseDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'release_date',
  },
  productAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'product_available',
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'stock_quantity',
  },
  imageName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'image_name',
  },
  imageType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'image_type',
  },
  imageData: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
    field: 'image_data',
  },
}, {
  tableName: 'product',
  timestamps: false,
});

export default Product;
