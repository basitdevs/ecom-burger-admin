"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Added for navigation
import { 
  Calendar, Clock, ChevronsRight, ChevronsLeft,
  Fish, ShoppingBag, Layers, Sun, MoreHorizontal
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from 'date-fns';

const TransactionsPage = () => {
  const router = useRouter(); // Initialize router
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if(Array.isArray(data)) setTransactions(data);
    } catch(e) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'PAID': 
      case 'APPROVED': return 'bg-blue-500/15 text-blue-600 border-blue-200 dark:border-blue-900'; 
      case 'DELIVERED': 
      case 'COMPLETED': return 'bg-green-500/15 text-green-600 border-green-200 dark:border-green-900'; 
      case 'CANCELLED': return 'bg-red-500/15 text-red-600 border-red-200 dark:border-red-900'; 
      default: return 'bg-muted text-foreground';
    }
  };

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
  
  // Navigate to details page
  const handleRowClick = (id: number) => {
    router.push(`/transactions/${id}`);
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 font-sans text-foreground">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Transactions</h1>
            <p className="text-muted-foreground">Monitor your orders and payments in real-time.</p>
        </div>
        
        {/* Simple Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto justify-between lg:justify-end">
          <div className="bg-muted border border-border rounded-md px-4 py-2 text-sm font-bold min-w-[150px] text-center">
            Total: {transactions.length}
          </div>
          <Select defaultValue="recent">
            <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
              <SelectValue placeholder="Sort View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="w-full bg-card rounded-lg border-border shadow-md overflow-hidden border">
        <div className="w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="py-4 whitespace-nowrap">Date</TableHead>
                <TableHead className="hidden sm:table-cell whitespace-nowrap">Payment ID</TableHead>
                <TableHead className="hidden md:table-cell whitespace-nowrap">Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Country</TableHead>
                <TableHead className="hidden xl:table-cell">Currency</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                 <TableRow><TableCell colSpan={8} className="text-center h-32">Loading Transactions...</TableCell></TableRow>
              ) : currentTransactions.length === 0 ? (
                 <TableRow><TableCell colSpan={8} className="text-center h-32">No transactions found.</TableCell></TableRow>
              ) : (
                currentTransactions.map((item, index) => (
                <TableRow 
                    key={index} 
                    // Add cursor-pointer and click handler
                    className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(item.id)}
                >
                  
                  {/* Date */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-primary hidden sm:block" />
                        <div className="flex flex-col">
                            <span className="font-bold text-sm whitespace-nowrap">{format(new Date(item.date), 'MMM dd')}</span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(item.date), 'hh:mm a')}</span>
                        </div>
                    </div>
                  </TableCell>
                  
                  {/* Payment ID */}
                  <TableCell className="font-mono text-xs hidden sm:table-cell text-muted-foreground">
                    {item.paymentId}
                  </TableCell>
                  
                  {/* Method */}
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center">
                          <ShoppingBag size={14} />
                       </div>
                       <span className="text-sm">{item.method}</span>
                    </div>
                  </TableCell>
                  
                  {/* Status */}
                  <TableCell>
                    <Badge className={`border shadow-none px-2 py-1 text-[10px] sm:text-xs whitespace-nowrap ${getStatusStyles(item.status)}`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  
                  {/* Country */}
                  <TableCell className="hidden lg:table-cell">{item.country}</TableCell>
                  
                  {/* Currency */}
                  <TableCell className="hidden xl:table-cell">{item.curr}</TableCell>
                  
                  {/* Amount */}
                  <TableCell className="font-bold text-sm sm:text-lg text-right whitespace-nowrap">
                    {item.total.toFixed(3)}
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRowClick(item.id); }}>
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                Print Receipt
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-end gap-2">
        <Button 
            variant="outline" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            size="icon"
            className="border-border h-8 w-8"
        >
            <ChevronsLeft size={16} />
        </Button>
        <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages || 1}</span>
        <Button 
            variant="outline" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            size="icon"
            className="border-border h-8 w-8"
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TransactionsPage;