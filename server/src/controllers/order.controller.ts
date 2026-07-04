import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";
import { HttpError } from "../errors/http-error";

const orderService = new OrderService();

// CREATE ORDER
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const {
      items,
      fullName,
      contact,
      address,
      city,
      landmark,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (
      !items ||
      !fullName ||
      !contact ||
      !address ||
      !city ||
      !paymentMethod ||
      !totalAmount
    ) {
      return next(new HttpError(400, "All required fields are required"));
    }

    const order = await orderService.createOrder({
      user: req.user._id,
      items,
      fullName,
      contact,
      address,
      city,
      landmark,
      paymentMethod,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      data: order,
      message: "Order placed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET LOGGED IN USER ORDERS
export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const orders = await orderService.getOrdersByUser(req.user._id);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};


// GET SINGLE ORDER
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await orderService.getOrderById(req.params.id as string);

    if (!order) {
      return next(new HttpError(404, "Order not found"));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
