"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, User, Mail, Phone, MapPin,
  ShoppingBag, Calendar, CreditCard, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { toast } from "sonner";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/customers/${id}`);
        if (!res.ok) throw new Error("Customer not found");
        const json = await res.json();
        setData(json);
      } catch (error) {
        toast.error("Error loading customer profile");
        router.push("/customers");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500/15 text-green-600';
      case 'PAID': return 'bg-blue-500/15 text-blue-600';
      case 'CANCELLED': return 'bg-red-500/15 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full min-h-screen bg-background p-4 md:p-8 font-sans text-foreground">

      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold">Customer Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Profile Info */}
        <div className="space-y-6">
          <Card className="bg-card border-border shadow-sm text-center">
            <CardContent className="pt-6 pb-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                <AvatarFallback className="text-3xl font-bold bg-muted text-primary">
                  {data.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{data.name}</h2>
              <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                <MapPin size={12} /> {data.country}
              </p>

              <div className="grid grid-cols-2 gap-4 w-full mt-6 text-sm">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <span className="block text-muted-foreground text-xs mb-1">Total Spent</span>
                  <span className="font-bold text-lg text-primary">{data.totalSpent.toFixed(3)} KWD</span>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <span className="block text-muted-foreground text-xs mb-1">Total Orders</span>
                  <span className="font-bold text-lg text-primary">{data.ordersCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-md text-blue-500"><Mail size={18} /></div>
                <div>
                  <span className="block text-xs text-muted-foreground">Email Address</span>
                  <span className="text-sm font-medium">{data.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-md text-green-500"><Phone size={18} /></div>
                <div>
                  <span className="block text-xs text-muted-foreground">Phone Number</span>
                  <span className="text-sm font-medium">{data.mobile || "N/A"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/10 p-2 rounded-md text-orange-500"><Shield size={18} /></div>
                <div>
                  <span className="block text-xs text-muted-foreground">Customer ID</span>
                  <span className="text-sm font-medium">#{data.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Order History */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border shadow-sm h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {data.orders.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-muted-foreground">
                  No orders found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.orders.map((order: any) => (
                      <TableRow key={order.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => router.push(`/transactions/${order.id}`)}>
                        <TableCell className="font-mono text-xs">#{order.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-muted-foreground" />
                            {format(new Date(order.created_at), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">{order.totalAmount.toFixed(3)} KWD</TableCell>
                        <TableCell>
                          <Badge className={`shadow-none ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}