"use server";

import { 
  getAllOrdersWithDetails, 
  getDashboardStats, 
  updateOrderStatusInDb,
  getOrderItems 
} from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function fetchOrderData(page: number = 1, period: string = "all") {
  try {
    const [ordersData, stats] = await Promise.all([
      getAllOrdersWithDetails(page, 10, period),
      getDashboardStats(),
    ]);

    // Parse Address JSON safely
    const parsedOrders = ordersData.orders.map((order) => {
      let shippingInfo = {};
      try {
        shippingInfo = JSON.parse(order.addressJson);
      } catch (e) {
        // ignore error
      }
      return { ...order, shippingInfo };
    });

    return { 
      success: true, 
      orders: parsedOrders, 
      totalCount: ordersData.totalCount,
      stats 
    };
  } catch (error) {
    console.error("Failed to fetch order data:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

export async function updateOrderStatusAction(orderId: number, newStatus: string) {
  try {
    const success = await updateOrderStatusInDb(orderId, newStatus);
    if(success) {
      revalidatePath("/orders"); // Refresh the page data on server
      return { success: true };
    }
    return { success: false };
  } catch (e) {
    return { success: false };
  }
}

export async function getOrderDetailsAction(orderId: number) {
    try {
        const items = await getOrderItems(orderId);
        return { success: true, items };
    } catch(e) {
        return { success: false, items: [] };
    }
}