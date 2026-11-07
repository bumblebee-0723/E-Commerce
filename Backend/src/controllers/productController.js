import * as productService from '../services/productService.js';

/**
 * Helper to parse product JSON from request body.
 * Frontend sends:
 * formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }))
 */
function extractProductPayload(req) {
  if (req.body.product) {
    if (typeof req.body.product === 'string') {
      try {
        return JSON.parse(req.body.product);
      } catch (err) {
        return req.body;
      }
    }
    return req.body.product;
  }
  return req.body;
}

export async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getProductById(req, res) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const product = await productService.getProductById(productId);

    if (product) {
      return res.status(200).json(productService.formatProduct(product));
    } else {
      return res.status(404).send();
    }
  } catch (error) {
    console.error('Error in getProductById:', error);
    return res.status(500).json({ message: error.message });
  }
}

export async function getImage(req, res) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const product = await productService.getProductById(productId);

    if (product && product.imageData) {
      res.setHeader('Content-Type', product.imageType || 'image/jpeg');
      return res.status(200).send(product.imageData);
    } else {
      return res.status(404).send();
    }
  } catch (error) {
    console.error('Error in getImage:', error);
    return res.status(500).json({ message: error.message });
  }
}

export async function addProduct(req, res) {
  try {
    const productData = extractProductPayload(req);
    const imageFile = req.file;

    const savedProduct = await productService.addProduct(productData, imageFile);
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error in addProduct:', error);
    return res.status(500).send(error.message);
  }
}

export async function updateProduct(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const productData = extractProductPayload(req);
    const imageFile = req.file;

    const existingProduct = await productService.getProductById(id);
    if (!existingProduct) {
      return res.status(404).send();
    }

    const updatedProduct = await productService.updateProduct(id, productData, imageFile);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return res.status(500).send(error.message);
  }
}

export async function deleteProduct(req, res) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const deleted = await productService.deleteProduct(productId);

    if (deleted) {
      return res.status(200).send('Deleted');
    } else {
      return res.status(404).send();
    }
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return res.status(500).json({ message: error.message });
  }
}

export async function search(req, res) {
  try {
    const keyword = req.query.keyword || '';
    console.log(`searching with :${keyword}`);
    const products = await productService.searchProducts(keyword);
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error in search:', error);
    return res.status(500).json({ message: error.message });
  }
}
