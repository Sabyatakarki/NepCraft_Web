import Order, { IOrder } from "../model/order.model";

export class OrderService {

  // Create Order
  async createOrder(orderData: Partial<IOrder>) {
    return await Order.create(orderData);
  }

  async getAllOrders() {
    return await Order.find()
      .populate("user", "username email")
      .populate("items.product")
      .sort({ createdAt: -1 });
  }

  async getOrdersByUser(userId: string) {
    return await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });
  }


  async getOrderById(orderId: string) {
    return await Order.findById(orderId)
      .populate("user", "username email")
      .populate("items.product");
  }

 
  async updateOrderStatus(orderId: string, status: string) {
    return await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
  }

 
  async deleteOrder(orderId: string) {
    return await Order.findByIdAndDelete(orderId);
  }
}