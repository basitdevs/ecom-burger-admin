"use client";

import React, { useEffect, useState } from "react";
import {
  MoreHorizontal,
  RefreshCcw,
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
  Filter,
  Download,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { toast } from "sonner";

import {
  fetchOrderData,
  updateOrderStatusAction,
  getOrderDetailsAction,
} from "./actions";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    DELIVERED:
      "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900",
    COMPLETED:
      "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900",
    PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900",
    CONFIRMED:
      "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900",
    SHIPPED:
      "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900",
    CANCELLED: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900",
  };

  return (
    <Badge
      variant="outline"
      className={`${
        styles[status] || "bg-muted text-muted-foreground border-border"
      } border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-colors`}
    >
      {status}
    </Badge>
  );
};

export default function OrdersDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState("all");
  const pageSize = 10;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-muted/40 text-foreground">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const { stats, orders, totalCount } = data || {
    stats: {},
    orders: [],
    totalCount: 0,
  };
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleExportCSV = () => {
    if (!data || !data.orders || data.orders.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Email",
      "Phone",
      "Product Name",
      "Quantity",
      "Category",
      "Total Amount (KWD)",
      "Status",
    ];

    const rows = data.orders.map((order: any) => {
      const safeText = (text: string) =>
        `"${(text || "").replace(/"/g, '""')}"`;

      return [
        order.id,
        format(new Date(order.date), "yyyy-MM-dd HH:mm"),
        safeText(order.customerName),
        safeText(order.customerEmail),
        safeText(order.customerPhone || order.shippingInfo?.phone),
        safeText(order.productName),
        order.itemsCount,
        safeText(order.categoryName),
        order.totalAmount.toFixed(3),
        order.status,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `orders_export_${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export successful!");
  };

  return (
    <div className="min-h-screen bg-muted/40 text-foreground p-4 md:p-8 font-sans space-y-8">
      {/* --- Top Bar --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Orders
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your store orders and monitor performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center px-3 py-1.5 bg-background border border-border rounded-md text-sm font-medium shadow-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span className="mr-2">{format(currentDate, "MMM d, yyyy")}</span>
            <span className="pl-2 border-l border-border">
              {format(currentDate, "HH:mm")}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={loadData}
            className="bg-background"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button
            onClick={handleExportCSV}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* --- KPI Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Revenue Card - Highlighted */}
        <Card className="bg-primary text-primary-foreground border-none shadow-md">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-foreground/80 font-medium">
              Total Revenue
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              ${stats.totalRevenue?.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Dynamic Calculation Logic (Mocked Goal) */}
            {(() => {
              const monthlyGoal = 10000;
              const progressValue = Math.min(
                ((stats.totalRevenue || 0) / monthlyGoal) * 100,
                100
              );

              return (
                <>
                  <div className="text-xs text-primary-foreground/70 mb-2 flex justify-between">
                    <span>
                      Progress to goal (${monthlyGoal.toLocaleString()})
                    </span>
                    <span>{progressValue.toFixed(0)}%</span>
                  </div>

                  <Progress
                    value={progressValue}
                    className="h-1.5 bg-primary-foreground/20 [&>*]:bg-primary-foreground"
                  />
                </>
              );
            })()}
          </CardContent>
        </Card>

        {[
          { title: "Total Orders", val: stats.totalOrders, icon: CheckSquare },
          { title: "Paid / Confirmed", val: stats.confirmedOrders, icon: List },
          { title: "Canceled", val: stats.cancelledOrders, icon: Ban },
          { title: "Completed", val: stats.completedOrders, icon: RotateCcw },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="bg-card text-card-foreground border-border shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {item.title}
              </span>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.val}</div>
              <p className="text-xs text-muted-foreground mt-1">
                From selected period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- Main Content --- */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Filter by:
            </span>
            <Select
              value={period}
              onValueChange={(val) => {
                setPeriod(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] bg-background border-border">
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

        {/* Table Card */}
        <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-border">
                  <TableHead className="w-[100px]">Order ID</TableHead>
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
                    <TableCell
                      colSpan={7}
                      className="text-center py-16 text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-10 w-10 opacity-20" />
                        <p>No orders found for this period.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order: any) => (
                    <TableRow
                      key={order.id}
                      className="border-border hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-semibold text-primary">
                        #{order.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-md border border-border">
                            <AvatarImage src={order.productImage} />
                            <AvatarFallback className="bg-muted text-muted-foreground rounded-md">
                              <Package size={16} />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-foreground">
                              {order.productName || "Unknown Product"}
                            </span>
                            {order.itemsCount > 1 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{order.itemsCount - 1} more items
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium text-foreground">
                            {order.customerName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {order.customerEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-normal bg-muted text-foreground hover:bg-muted/80"
                        >
                          {order.categoryName}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-sm">
                        ${order.totalAmount}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground"
                            >
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[180px]"
                          >
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
                              <Truck className="mr-2 h-4 w-4 text-amber-500" />{" "}
                              Mark Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(order.id, "DELIVERED")
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />{" "}
                              Mark Delivered
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(order.id, "CANCELLED")
                              }
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
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
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center pt-2">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(page * pageSize, totalCount)}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span> entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="bg-background border-border"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="bg-background border-border"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- ORDER DETAILS DIALOG --- */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl bg-card border-border text-foreground">
          <DialogHeader>
            <div className="flex justify-between items-center mr-6">
              <DialogTitle className="text-xl">Order Details</DialogTitle>
              <Badge variant="outline" className="text-sm">
                #{selectedOrder?.id}
              </Badge>
            </div>
            <DialogDescription className="text-muted-foreground">
              Order placed on{" "}
              {selectedOrder
                ? format(new Date(selectedOrder.date), "PPP 'at' p")
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {/* Customer Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin size={14} className="text-primary" /> Shipping
                    Address
                  </h4>
                  <div className="text-sm bg-muted/40 border border-border p-3 rounded-lg text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">
                      {selectedOrder.customerName}
                    </p>
                    <div className="space-y-0.5">
                      <p>
                        {selectedOrder.shippingInfo?.area}, Block{" "}
                        {selectedOrder.shippingInfo?.block}
                      </p>
                      <p>
                        {selectedOrder.shippingInfo?.street}{" "}
                        {selectedOrder.shippingInfo?.house}
                      </p>
                      <p>{selectedOrder.shippingInfo?.avenue}</p>
                    </div>
                    {selectedOrder.shippingInfo?.specialDirections && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-amber-600 dark:text-amber-500 text-xs font-medium">
                          Note: {selectedOrder.shippingInfo.specialDirections}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Phone size={14} className="text-primary" /> Contact Details
                  </h4>
                  <div className="text-sm bg-muted/40 border border-border p-3 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail size={14} />{" "}
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={14} />{" "}
                      <span>
                        {selectedOrder.customerPhone ||
                          selectedOrder.shippingInfo?.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Column */}
              <div className="space-y-4 flex flex-col h-full">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Package size={14} className="text-primary" /> Order Items
                  </h4>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {loadingItems ? (
                      <div className="flex justify-center py-4">
                        <RefreshCcw className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      orderItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-muted/40 border border-border p-2.5 rounded-lg group hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-background rounded-md overflow-hidden border border-border">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground line-clamp-1">
                                {item.productName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-sm text-foreground whitespace-nowrap">
                            {item.price.toFixed(3)}{" "}
                            <span className="text-[10px] text-muted-foreground font-normal">
                              KWD
                            </span>
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Total Summary */}
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <span className="font-semibold text-primary">
                      Total Amount
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {selectedOrder.totalAmount.toFixed(3)}{" "}
                      <span className="text-sm font-medium text-muted-foreground">
                        KWD
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 border-t border-border pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDetailsOpen(false)}
              className="bg-background"
            >
              Close
            </Button>
            <Button onClick={() => window.print()}>Print Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
