import * as orderService from '../services/orderService.js';

export async function placeOrder(req, res) {
  try {
    const orderRequest = req.body;
    const orderResponse = await orderService.placeOrder(orderRequest);
    return res.status(201).json(orderResponse);
  } catch (error) {
    console.error('Error in placeOrder:', error);
    return res.status(400).json({ message: error.message });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orderResponses = await orderService.getAllOrderResponses();
    return res.status(200).json(orderResponses);
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    return res.status(500).json({ message: error.message });
  }
}
