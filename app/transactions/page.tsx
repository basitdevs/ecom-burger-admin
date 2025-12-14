"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronsRight, 
  ChevronsLeft,
  Fish,       // For Whale logo
  ShoppingBag, // For Albo logo
  Layers,     // For Ecom logo
  Sun         // For Delight logo
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const TransactionsPage = () => {
  
  // --- 1. State for Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- 2. Mock Data ---
  const allTransactions = [
    {
      id: 1,
      date: '24/11/2025',
      time: '12:34 PM',
      seller: 'Whale',
      logoIcon: <Fish size={20} className="text-[#3b82f6]" />, 
      logoBg: 'bg-white',
      sku: '94781',
      method: 'Mastercard',
      type: 'Payment',
      status: 'APPROVED',
      country: 'France',
      curr: 'OMR',
      fee: '3242.57',
      tax: '0.3',
      total: '$3232.84'
    },
    {
      id: 2,
      date: '16/11/2025',
      time: '07:00 AM',
      seller: 'Albo E-Store',
      logoIcon: <ShoppingBag size={20} className="text-black" />,
      logoBg: 'bg-white',
      sku: '68368',
      method: 'Visa',
      type: 'Withdrawal',
      status: 'WAITING',
      country: 'USA',
      curr: 'GNF',
      fee: '5410.06',
      tax: '1.0',
      total: '$5355.96'
    },
    {
      id: 3,
      date: '08/11/2025',
      time: '07:40 PM',
      seller: 'Ecom',
      logoIcon: <Layers size={20} className="text-[#fb923c]" />,
      logoBg: 'bg-white',
      sku: '37567',
      method: 'Visa',
      type: 'Invoice',
      status: 'APPROVED',
      country: 'USA',
      curr: 'BGN',
      fee: '1435.79',
      tax: '0.2',
      total: '$1432.92'
    },
    {
      id: 4,
      date: '07/11/2025',
      time: '04:01 PM',
      seller: 'Delight',
      logoIcon: <Sun size={20} className="text-[#84cc16]" />,
      logoBg: 'bg-white',
      sku: '55115',
      method: 'Switch',
      type: 'Payment',
      status: 'CANCELLED',
      country: 'Italy',
      curr: 'RWF',
      fee: '5548.04',
      tax: '0.3',
      total: '$5531.40'
    },
    {
      id: 5,
      date: '15/09/2025',
      time: '01:42 PM',
      seller: 'Albo E-Store',
      logoIcon: <ShoppingBag size={20} className="text-black" />,
      logoBg: 'bg-white',
      sku: '28821',
      method: 'Mastercard',
      type: 'Withdrawal',
      status: 'APPROVED',
      country: 'Sweden',
      curr: 'MYR',
      fee: '9597.92',
      tax: '0.5',
      total: '$9549.93'
    },
    {
      id: 6,
      date: '04/09/2025',
      time: '07:40 PM',
      seller: 'Delight',
      logoIcon: <Sun size={20} className="text-[#84cc16]" />,
      logoBg: 'bg-white',
      sku: '13236',
      method: 'Visa',
      type: 'Deposit',
      status: 'REJECTED',
      country: 'USA',
      curr: 'SLE',
      fee: '9667.23',
      tax: '0.3',
      total: '$9638.23'
    },
    // Page 2 Data
    {
      id: 7,
      date: '01/09/2025',
      time: '10:00 AM',
      seller: 'Whale',
      logoIcon: <Fish size={20} className="text-[#3b82f6]" />,
      logoBg: 'bg-white',
      sku: '88421',
      method: 'Paypal',
      type: 'Payment',
      status: 'APPROVED',
      country: 'Germany',
      curr: 'EUR',
      fee: '120.00',
      tax: '0.1',
      total: '$150.00'
    },
    {
      id: 8,
      date: '30/08/2025',
      time: '02:15 PM',
      seller: 'Ecom',
      logoIcon: <Layers size={20} className="text-[#fb923c]" />,
      logoBg: 'bg-white',
      sku: '33211',
      method: 'Visa',
      type: 'Invoice',
      status: 'WAITING',
      country: 'Canada',
      curr: 'CAD',
      fee: '500.00',
      tax: '0.5',
      total: '$550.00'
    },
    {
      id: 9,
      date: '25/08/2025',
      time: '09:30 AM',
      seller: 'Albo E-Store',
      logoIcon: <ShoppingBag size={20} className="text-black" />,
      logoBg: 'bg-white',
      sku: '77482',
      method: 'Mastercard',
      type: 'Withdrawal',
      status: 'CANCELLED',
      country: 'UK',
      curr: 'GBP',
      fee: '2300.00',
      tax: '0.8',
      total: '$2350.00'
    },
    {
      id: 10,
      date: '20/08/2025',
      time: '06:45 PM',
      seller: 'Delight',
      logoIcon: <Sun size={20} className="text-[#84cc16]" />,
      logoBg: 'bg-white',
      sku: '66554',
      method: 'Amex',
      type: 'Payment',
      status: 'APPROVED',
      country: 'Spain',
      curr: 'EUR',
      fee: '890.00',
      tax: '0.2',
      total: '$910.00'
    },
    {
      id: 11,
      date: '15/08/2025',
      time: '11:20 AM',
      seller: 'Whale',
      logoIcon: <Fish size={20} className="text-[#3b82f6]" />,
      logoBg: 'bg-white',
      sku: '55441',
      method: 'Visa',
      type: 'Refund',
      status: 'APPROVED',
      country: 'France',
      curr: 'EUR',
      fee: '50.00',
      tax: '0.0',
      total: '$50.00'
    },
    {
      id: 12,
      date: '10/08/2025',
      time: '03:50 PM',
      seller: 'Ecom',
      logoIcon: <Layers size={20} className="text-[#fb923c]" />,
      logoBg: 'bg-white',
      sku: '22331',
      method: 'Mastercard',
      type: 'Payment',
      status: 'REJECTED',
      country: 'USA',
      curr: 'USD',
      fee: '1200.00',
      tax: '0.4',
      total: '$1240.00'
    }
  ];

  // --- 3. Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = allTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allTransactions.length / itemsPerPage);

  // --- Helper for Status Styles ---
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-[#3b82f6] text-white hover:bg-[#3b82f6]'; 
      case 'WAITING':
        return 'bg-[#10b981] text-[#020617] hover:bg-[#10b981]'; 
      case 'CANCELLED':
        return 'bg-[#ef4444] text-white hover:bg-[#ef4444]'; 
      case 'REJECTED':
        return 'bg-[#9ca3af] text-[#020617] hover:bg-[#9ca3af]'; 
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // --- Handlers ---
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] p-4 md:p-8 font-sans text-slate-300">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-white font-bold text-lg">Transaction date from:</label>
          <div className="relative w-full md:w-[280px]">
            <Input 
              type="text" 
              value="01/01/2025 - 14/12/2025" 
              readOnly
              className="bg-[#0b1b36] border-slate-700 text-white text-sm font-bold rounded-md py-6 pl-4 pr-12 w-full focus-visible:ring-offset-0 focus-visible:ring-0 focus:border-blue-500 transition"
            />
            <Calendar className="absolute right-4 top-3.5 text-[#3b82f6]" size={18} />
          </div>
        </div>

        <div className="flex flex-col gap-2 items-start md:items-end w-full md:w-auto">
          <span className="text-slate-400 text-sm font-medium">
            View transactions: {currentTransactions.length}/{allTransactions.length}
          </span>
          <Select defaultValue="recent">
            <SelectTrigger className="w-full md:w-[180px] bg-[#0b1b36] border-slate-700 text-white text-sm font-medium h-[42px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent className="bg-[#0b1b36] border-slate-700 text-white">
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="w-full bg-[#031123] rounded-lg border-slate-800/50 shadow-xl overflow-hidden border">
        <div className="overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-slate-800 hover:bg-transparent">
                <TableHead className="py-5 px-6 text-left text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider whitespace-nowrap">
                  Date & Time
                </TableHead>

                <TableHead className="py-5 px-6 text-left text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider whitespace-nowrap">
                  Seller
                </TableHead>

                <TableHead className="py-5 px-6 text-left text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider hidden xl:table-cell">
                  Sku
                </TableHead>

                <TableHead className="py-5 px-6 text-left text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider hidden xl:table-cell">
                  Method
                </TableHead>

                <TableHead className="py-5 px-6 text-left text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider whitespace-nowrap">
                  Type
                </TableHead>

                <TableHead className="py-5 px-6 text-left text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider">
                  Status
                </TableHead>

                <TableHead className="py-5 px-6 text-left text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider hidden xl:table-cell">
                  Country
                </TableHead>

                <TableHead className="py-5 px-6 text-left text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider hidden xl:table-cell">
                  Curr
                </TableHead>

                <TableHead className="py-5 px-6 text-left text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider hidden xl:table-cell">
                  Fee
                </TableHead>

                <TableHead className="py-5 px-6 text-left text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider hidden xl:table-cell">
                  Tax
                </TableHead>

                <TableHead className="py-5 px-6 text-left text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentTransactions.map((item, index) => (
                <TableRow 
                  key={item.id} 
                  className={cn(
                    "border-b border-slate-800/50 transition-colors group hover:bg-[#0b1b36]/80",
                    index % 2 === 0 ? "bg-[#0b1b36]" : "bg-transparent"
                  )}
                >
                  <TableCell className="py-5 px-6 whitespace-nowrap">
                    <div className="flex items-start gap-2.5">
                      <Clock size={16} className="text-[#3b82f6] mt-1 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">{item.date}</span>
                        <span className="text-slate-400 text-xs font-medium mt-0.5">at {item.time}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${item.logoBg} flex items-center justify-center shrink-0`}>
                        {item.logoIcon}
                      </div>
                      <span className="text-white font-bold text-sm">{item.seller}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-5 px-6 text-white font-medium text-sm hidden xl:table-cell">{item.sku}</TableCell>

                  <TableCell className="py-5 px-6 text-white font-medium text-sm hidden xl:table-cell">{item.method}</TableCell>

                  <TableCell className="py-5 px-6 text-white font-medium text-sm">{item.type}</TableCell>

                  <TableCell className="py-5 px-6">
                    <Badge className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border-none shadow-none ${getStatusStyles(item.status)}`}>
                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-5 px-6 text-white font-medium text-sm hidden xl:table-cell">{item.country}</TableCell>

                  <TableCell className="py-5 px-6 text-white font-medium text-sm hidden xl:table-cell">{item.curr}</TableCell>

                  <TableCell className="py-5 px-6 text-slate-300 font-medium text-sm hidden xl:table-cell">{item.fee}</TableCell>

                  <TableCell className="py-5 px-6 text-slate-300 font-medium text-sm hidden xl:table-cell">{item.tax}</TableCell>

                  <TableCell className="py-5 px-6 text-white font-bold text-sm">{item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="mt-6 flex items-center gap-2">
        {currentPage > 1 && (
            <Button 
                variant="outline" 
                onClick={handlePrevPage}
                className="w-9 h-9 p-0 border-slate-700 bg-transparent text-[#3b82f6] hover:bg-slate-800 hover:text-[#3b82f6]"
            >
                <ChevronsLeft size={18} />
            </Button>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => handlePageClick(page)}
            variant={currentPage === page ? "default" : "outline"}
            className={`w-9 h-9 p-0 text-bold text-sm shadow-lg transition
              ${currentPage === page 
                ? 'bg-[#3b82f6] text-white shadow-blue-900/50 hover:bg-[#2563eb]' 
                : 'border-slate-700 bg-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-300'
              }`}
          >
            {page}
          </Button>
        ))}

        <Button 
            variant="outline" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`w-9 h-9 p-0 border-slate-700 bg-transparent text-[#3b82f6] hover:bg-slate-800 hover:text-[#3b82f6] 
                ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ChevronsRight size={18} />
        </Button>
      </div>

    </div>
  );
};

export default TransactionsPage;