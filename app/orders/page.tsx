"use client";

import React, { useEffect, useState } from "react";
import {
  MoreHorizontal,
  RefreshCcw,
  Calendar as CalendarIcon,
  CheckSquare,
  List,
  Ban,
  RotateCcw,
  Package,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"; // Assuming you have sonner or use standard alert

// Import Actions
import {
  fetchOrderData,
  updateOrderStatusAction,
  getOrderDetailsAction,
} from "./actions";

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    DELIVERED:
      "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    COMPLETED:
      "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    PAID: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    CONFIRMED:
      "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    SHIPPED:
      "bg-yellow-500/15 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
    CANCELLED:
      "bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  };
  return (
    <Badge
      className={`${
        styles[status] || "bg-gray-100 text-gray-800"
      } border-0 px-2 py-1`}
    >
      {status}
    </Badge>
  );
};

export default function OrdersDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Pagination & Filtering State
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState("all");
  const pageSize = 10;

  // Modal State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Load Data Function
  const loadData = async () => {
    setLoading(true);
    const result = await fetchOrderData(page, period);
    if (result.success) {
      setData({
        orders: result.orders,
        stats: result.stats,
        totalCount: result.totalCount,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, [page, period]);

  // Actions
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    toast.promise(updateOrderStatusAction(orderId, newStatus), {
      loading: "Updating status...",
      success: () => {
        loadData();
        return `Order marked as ${newStatus}`;
      },
      error: "Failed to update",
    });
  };

  const openOrderDetails = async (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
    setLoadingItems(true);
    const result = await getOrderDetailsAction(order.id);
    if (result.success) {
      setOrderItems(result.items);
    }
    setLoadingItems(false);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0b1121]">
        <RefreshCcw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const { stats, orders, totalCount } = data || {
    stats: {},
    orders: [],
    totalCount: 0,
  };
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1121] text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={loadData}
            variant="ghost"
            className="text-blue-600 dark:text-blue-400"
          >
            Data Refresh <RefreshCcw className="ml-2 h-4 w-4" />
          </Button>
          <div className="hidden md:flex items-center px-4 py-2 bg-white dark:bg-[#151e32] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium shadow-sm">
            <span className="text-gray-500 dark:text-gray-400 mr-2">
              {format(currentDate, "MMMM d, yyyy")}
            </span>
            <span>{format(currentDate, "HH:mm a")}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-end">
        <div>
          <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Sales period:
          </div>
          <div className="flex gap-4">
            <Select
              value={period}
              onValueChange={(val) => {
                setPeriod(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] bg-white dark:bg-[#151e32]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="bg-gray-900 text-white border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">Total</span>
              <span className="font-bold">
                ${stats.totalRevenue?.toLocaleString()}
              </span>
            </div>
            <Progress value={75} className="h-2 bg-gray-700" />
          </CardContent>
        </Card>
        {/* Helper function for cards */}
        {[
          {
            title: "Total Orders",
            val: stats.totalOrders,
            icon: CheckSquare,
            color: "blue",
          },
          {
            title: "Paid / Confirmed",
            val: stats.confirmedOrders,
            icon: List,
            color: "emerald",
          },
          {
            title: "Canceled",
            val: stats.cancelledOrders,
            icon: Ban,
            color: "red",
          },
          {
            title: "Completed",
            val: stats.completedOrders,
            icon: RotateCcw,
            color: "gray",
          },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="bg-white dark:bg-[#151e32] border-gray-100 dark:border-gray-800"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div
                className={`bg-${item.color}-100 dark:bg-${item.color}-900/30 p-2 rounded-lg`}
              >
                <item.icon
                  className={`h-5 w-5 text-${item.color}-600 dark:text-${item.color}-400`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-gray-500">
                {item.title}
              </div>
              <div className="text-2xl font-bold mt-1">{item.val}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151e32] shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-[#1a243a]">
            <TableRow>
              <TableHead># Order</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#1e2a42]"
                >
                  <TableCell className="font-semibold text-blue-600">
                    #{order.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-md bg-gray-100">
                        <AvatarImage src={order.productImage} />
                        <AvatarFallback>
                          <Package size={16} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium text-sm block">
                          {order.productName || "Product"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {order.itemsCount > 1
                            ? `+${order.itemsCount - 1} more items`
                            : ""}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="font-medium">{order.customerName}</span>
                      <span className="text-xs text-gray-400">
                        {order.customerEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {order.categoryName}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">
                    ${order.totalAmount}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => openOrderDetails(order)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order.id, "SHIPPED")
                          }
                        >
                          <Truck className="mr-2 h-4 w-4" /> Mark Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order.id, "DELIVERED")
                          }
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Mark
                          Delivered
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(order.id, "CANCELLED")
                          }
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* --- ORDER DETAILS MODAL --- */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-[#151e32]">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id} Details</DialogTitle>
            <DialogDescription>
              Placed on{" "}
              {selectedOrder
                ? format(new Date(selectedOrder.date), "PPP p")
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Customer Info */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <MapPin size={16} /> Shipping Address
                </h4>
                <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p>
                    {selectedOrder.shippingInfo?.area}, Block{" "}
                    {selectedOrder.shippingInfo?.block}
                  </p>
                  <p>
                    {selectedOrder.shippingInfo?.street}{" "}
                    {selectedOrder.shippingInfo?.house}
                  </p>
                  <p>{selectedOrder.shippingInfo?.avenue}</p>
                  {selectedOrder.shippingInfo?.specialDirections && (
                    <p className="text-yellow-600 mt-1 text-xs">
                      Note: {selectedOrder.shippingInfo.specialDirections}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Phone size={16} /> Contact Info
                </h4>
                <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={14} /> {selectedOrder.customerEmail}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} />{" "}
                    {selectedOrder.customerPhone ||
                      selectedOrder.shippingInfo?.phone}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex justify-between items-center">
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    Total Paid
                  </span>
                  <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {selectedOrder.totalAmount.toFixed(3)} KWD
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="md:col-span-2">
                <Separator className="my-2" />
                <h4 className="font-semibold mb-3">Order Items</h4>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  {loadingItems ? (
                    <p className="text-sm text-gray-500">Loading items...</p>
                  ) : (
                    orderItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-white rounded overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-sm">
                          {item.price.toFixed(3)} KWD
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
