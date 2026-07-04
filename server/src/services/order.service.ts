import Order, { IOrder } from "../model/order.model";

export class OrderService {

  // Create Order
  async createOrder(orderData: Partial<IOrder>) {
    return await Order.create(orderData);
  }

  // Get all orders (Admin)
  async getAllOrders() {
    return await Order.find()
      .populate("user", "username email")
      .populate("items.product")
      .sort({ createdAt: -1 });
  }

  // Get orders of logged in user
  async getOrdersByUser(userId: string) {
    return await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });
  }

  // Get single order
  async getOrderById(orderId: string) {
    return await Order.findById(orderId)
      .populate("user", "username email")
      .populate("items.product");
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    return await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
  }

  // Delete order
  async deleteOrder(orderId: string) {
    return await Order.findByIdAndDelete(orderId);
  }
}