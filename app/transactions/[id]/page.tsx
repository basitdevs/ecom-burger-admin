"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Download,
  CreditCard,
  Calendar,
  User,
  MapPin,
  Mail,
  Phone,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "sonner";

export default function TransactionDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/transactions/${id}`);
        if (!res.ok) throw new Error("Transaction not found");
        const json = await res.json();
        setData(json);
      } catch (error) {
        toast.error("Error loading details");
        router.push("/transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleInvoiceClick = () => {
    window.open(`/invoice/${id}`, "_blank");
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PAID":
      case "APPROVED":
        return "bg-blue-500/15 text-blue-600 border-blue-200 dark:border-blue-900";
      case "DELIVERED":
      case "COMPLETED":
        return "bg-green-500/15 text-green-600 border-green-200 dark:border-green-900";
      case "CANCELLED":
        return "bg-red-500/15 text-red-600 border-red-200 dark:border-red-900";
      default:
        return "bg-muted text-foreground";
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">
            Loading Transaction...
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full min-h-screen bg-background md:p-8 pb-8 font-sans text-foreground">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Transaction #{data.id}
              <Badge
                className={`text-xs font-bold border shadow-none ${getStatusStyles(
                  data.status
                )}`}
              >
                {data.status}
              </Badge>
            </h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
              <Calendar size={14} />
              {format(new Date(data.date), "MMMM dd, yyyy 'at' hh:mm a")}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* <Button variant="outline" className="gap-2" onClick={handleInvoiceClick}>
            <Printer size={16} /> Print
          </Button> */}
          <Button
            className="gap-2 bg-primary text-primary-foreground"
            onClick={handleInvoiceClick}
          >
            <Download size={16} /> Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transaction Items & Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={20} className="text-primary" />
                Purchased Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((item: any, idx: number) => (
                      <TableRow key={idx} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-muted border border-border overflow-hidden flex-shrink-0">
                              <img
                                src={item.image || "/placeholder.png"}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-medium text-sm">
                              {item.productName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.price.toFixed(3)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {(item.price * item.quantity).toFixed(3)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="font-mono font-medium">{data.paymentId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">{data.paymentMethod}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{data.totalAmount.toFixed(3)} KWD</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>0.000 KWD</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-primary">
                  {data.totalAmount.toFixed(3)} KWD
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-6">
          {/* Customer Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} className="text-primary" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {data.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    {data.customerName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Registered Customer
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-muted-foreground" />
                <span className="truncate">{data.customerEmail}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-muted-foreground" />
                <span>{data.customerPhone || "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address Card */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-medium text-foreground">
                {data.shippingInfo?.area || "Pickup"}
              </p>
              {data.shippingInfo?.block && (
                <div className="text-muted-foreground space-y-1">
                  <p>
                    Block {data.shippingInfo.block}, Street{" "}
                    {data.shippingInfo.street}
                  </p>
                  <p>House {data.shippingInfo.house}</p>
                  {data.shippingInfo.avenue && (
                    <p>Avenue {data.shippingInfo.avenue}</p>
                  )}
                </div>
              )}
              {data.shippingInfo?.specialDirections && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-md text-xs">
                  <span className="font-bold block mb-1">Note:</span>
                  {data.shippingInfo.specialDirections}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
