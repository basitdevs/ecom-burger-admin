"use client";

import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  MoreHorizontal,
  Search,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';

interface Customer {
  id: number;
  name: string;
  email: string;
  mobile: string;
  country: string;
  ordersCount: number;
  totalSpent: number;
}

const CustomersPage = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Chart Data
  const [pieData, setPieData] = useState([
    { name: 'New (0 Orders)', value: 0, color: '#fbbf24' },
    { name: 'Active (1-5 Orders)', value: 0, color: '#3b82f6' },
    { name: 'VIP (>5 Orders)', value: 0, color: '#273142' },
  ]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCustomers(data);

        // Calculate Segments
        const newC = data.filter(c => c.ordersCount === 0).length;
        const activeC = data.filter(c => c.ordersCount > 0 && c.ordersCount <= 5).length;
        const vipC = data.filter(c => c.ordersCount > 5).length;

        setPieData([
          { name: 'New (0 Orders)', value: newC, color: '#fbbf24' },
          { name: 'Active (1-5 Orders)', value: activeC, color: '#3b82f6' },
          { name: 'VIP (>5 Orders)', value: vipC, color: '#273142' },
        ]);
      }
    } catch (error) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter Logic
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(p => p - 1); };

  const handleViewDetails = (id: number) => {
    router.push(`/customers/${id}`);
  };

  return (
    <div className='w-full min-h-screen bg-background text-foreground flex-col justify-center items-center p-6 font-sans'>

      {/* Header */}
      <div className="w-full bg-card p-6 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4 border border-border shadow-sm mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={fetchCustomers} className="gap-2">
            Data Refresh <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </Button>
          <div className="bg-muted border border-border rounded-sm px-6 py-2 font-bold min-w-[150px] text-center">
            Total: {customers.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">

        {/* Retention Chart */}
        <Card className="lg:col-span-4 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Customer Segmentation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }} itemStyle={{ color: 'var(--foreground)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs mt-4">
              {pieData.map((p, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                  <span>{p.name}: <strong>{p.value}</strong></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Table */}
        <Card className="lg:col-span-8 bg-card border-border shadow-sm overflow-hidden flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Customer List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name or email..."
                className="pl-8 h-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Email / Phone</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center h-24">Loading...</TableCell></TableRow>
                  ) : currentItems.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center h-24">No customers found.</TableCell></TableRow>
                  ) : (
                    currentItems.map((c) => (
                      <TableRow
                        key={c.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleViewDetails(c.id)}
                      >
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{c.email}</span>
                            <span className="text-xs text-muted-foreground">{c.mobile || '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>{c.country}</TableCell>
                        <TableCell>{c.ordersCount}</TableCell>
                        <TableCell className="font-bold">{c.totalSpent?.toFixed(3)} KWD</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(c.id);
                              }}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Block Customer
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

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4 border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages || 1}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronsRight size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomersPage;