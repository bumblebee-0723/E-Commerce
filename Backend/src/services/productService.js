import { Op, Sequelize } from 'sequelize';
import { Product } from '../models/index.js';

/**
 * Formats product instance/JSON:
 * Converts raw Buffer imageData to base64 string matching Jackson's serialization from Spring Boot.
 */
export function formatProduct(product) {
  if (!product) return null;
  const p = typeof product.toJSON === 'function' ? product.toJSON() : { ...product };
  
  if (p.imageData) {
    if (Buffer.isBuffer(p.imageData)) {
      p.imageData = p.imageData.toString('base64');
    } else if (typeof p.imageData === 'object' && Array.isArray(p.imageData.data)) {
      p.imageData = Buffer.from(p.imageData.data).toString('base64');
    }
  } else {
    p.imageData = null;
  }

  return p;
}

export async function getAllProducts() {
  const products = await Product.findAll();
  return products.map(formatProduct);
}

export async function getProductById(id) {
  const product = await Product.findByPk(id);
  return product;
}

export async function addProduct(productData, imageFile) {
  const payload = {
    name: productData.name,
    description: productData.description,
    brand: productData.brand,
    price: productData.price !== undefined ? parseFloat(productData.price) : 0,
    category: productData.category,
    releaseDate: productData.releaseDate ? new Date(productData.releaseDate) : null,
    productAvailable: productData.productAvailable === true || productData.productAvailable === 'true',
    stockQuantity: productData.stockQuantity !== undefined ? parseInt(productData.stockQuantity, 10) : 0,
  };

  if (imageFile && imageFile.buffer) {
    payload.imageName = imageFile.originalname;
    payload.imageType = imageFile.mimetype;
    payload.imageData = imageFile.buffer;
  }

  const created = await Product.create(payload);
  return formatProduct(created);
}

export async function updateProduct(id, productData, imageFile) {
  const product = await Product.findByPk(id);
  if (!product) {
    return null;
  }

  const payload = {
    name: productData.name !== undefined ? productData.name : product.name,
    description: productData.description !== undefined ? productData.description : product.description,
    brand: productData.brand !== undefined ? productData.brand : product.brand,
    price: productData.price !== undefined ? parseFloat(productData.price) : product.price,
    category: productData.category !== undefined ? productData.category : product.category,
    releaseDate: productData.releaseDate ? new Date(productData.releaseDate) : product.releaseDate,
    productAvailable: productData.productAvailable !== undefined
      ? (productData.productAvailable === true || productData.productAvailable === 'true')
      : product.productAvailable,
    stockQuantity: productData.stockQuantity !== undefined
      ? parseInt(productData.stockQuantity, 10)
      : product.stockQuantity,
  };

  if (imageFile && imageFile.buffer) {
    payload.imageName = imageFile.originalname;
    payload.imageType = imageFile.mimetype;
    payload.imageData = imageFile.buffer;
  }

  await product.update(payload);
  return formatProduct(product);
}

export async function deleteProduct(id) {
  const product = await Product.findByPk(id);
  if (!product) {
    return false;
  }
  await product.destroy();
  return true;
}

export async function searchProducts(keyword) {
  if (!keyword || keyword.trim() === '') {
    return getAllProducts();
  }

  const term = `%${keyword.trim().toLowerCase()}%`;

  const products = await Product.findAll({
    where: {
      [Op.or]: [
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), { [Op.like]: term }),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('description')), { [Op.like]: term }),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('brand')), { [Op.like]: term }),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('category')), { [Op.like]: term }),
      ],
    },
  });

  return products.map(formatProduct);
}
