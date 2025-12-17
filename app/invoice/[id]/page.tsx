"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from 'html2canvas-pro';
import jsPDF from "jspdf";

export default function InvoicePage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/transactions/${id}`);
        if (!res.ok) throw new Error("Invoice not found");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
        toast.error("Could not load invoice data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // PDF Download Logic
  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    setDownloading(true);

    try {
      const element = invoiceRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      pdf.save(`Invoice-${data.paymentId || id}.pdf`);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (!data) return <div className="p-8 text-center text-black">Invoice not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8 font-mono print:p-0 print:bg-white">
      
      {/* Action Buttons (Hidden in Print/PDF) */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-end gap-3 print:hidden">
        {/* <Button variant="outline" onClick={() => window.print()} className="gap-2 bg-white border-gray-300 hover:bg-gray-100 text-black">
          <Printer size={16} /> Print
        </Button> */}
        <Button onClick={handleDownloadPdf} disabled={downloading} className="gap-2 bg-black text-white hover:bg-gray-800">
          {downloading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {downloading ? "Generating..." : "Download PDF"}
        </Button>
      </div>

      {/* Invoice Content - Wrapped in ref for capture */}
      <div 
        ref={invoiceRef}
        className="max-w-3xl mx-auto border border-gray-200 bg-white p-12 shadow-sm print:shadow-none print:border-none"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider text-black">Invoice</h1>
            <p className="text-sm mt-2 text-gray-500 font-bold">#{data.paymentId}</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold text-xl mb-1 text-black">Ecom-Burger</h2>
            <p className="text-sm text-gray-600">123 Burger Street</p>
            <p className="text-sm text-gray-600">Kuwait City, Kuwait</p>
            <p className="text-sm text-gray-600">support@ecom-burger.com</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-12 mb-10 text-sm">
          <div>
            <h3 className="font-bold mb-3 text-gray-400 uppercase text-xs tracking-wider">Bill To</h3>
            <p className="font-bold text-lg text-black">{data.customerName}</p>
            <p className="text-gray-600">{data.customerEmail}</p>
            <p className="text-gray-600">{data.customerPhone}</p>
            <div className="mt-4 text-gray-600">
                <p className="font-semibold text-xs text-gray-400 uppercase mb-1">Shipping Address:</p>
                <p>{data.shippingInfo?.area || "Pickup"}</p>
                {data.shippingInfo?.block && (
                    <p>Block {data.shippingInfo.block}, St {data.shippingInfo.street}, H {data.shippingInfo.house}</p>
                )}
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
              <span className="font-bold text-gray-500 uppercase text-xs">Date</span>
              <span>{format(new Date(data.date), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
              <span className="font-bold text-gray-500 uppercase text-xs">Status</span>
              <span className="uppercase font-bold text-black">{data.status}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-gray-300 pb-1">
                <span className="font-bold text-gray-500 uppercase text-xs">Method</span>
                <span>{data.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-8 text-sm">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-3 font-bold uppercase text-xs text-black">Item Description</th>
              <th className="text-center py-3 font-bold uppercase text-xs text-black">Qty</th>
              <th className="text-right py-3 font-bold uppercase text-xs text-black">Price</th>
              <th className="text-right py-3 font-bold uppercase text-xs text-black">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item: any, i: number) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-4 font-medium text-black">{item.productName}</td>
                <td className="text-center py-4 text-gray-600">{item.quantity}</td>
                <td className="text-right py-4 text-gray-600">{item.price.toFixed(3)}</td>
                <td className="text-right py-4 font-bold text-black">{(item.price * item.quantity).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-black">{data.totalAmount.toFixed(3)} KWD</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (0%):</span>
              <span className="font-medium text-black">0.000 KWD</span>
            </div>
            <div className="flex justify-between text-sm pb-4 border-b border-gray-200">
              <span className="text-gray-600">Delivery:</span>
              <span className="font-medium text-black">0.000 KWD</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2">
              <span className="text-black">Total:</span>
              <span className="text-black">{data.totalAmount.toFixed(3)} KWD</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-100 pt-8 mt-16 text-center">
          <p className="text-lg font-bold mb-2 text-black">Thank you for your business!</p>
          <p className="text-gray-500 text-xs">
            If you have any questions about this invoice, please contact us at support@ecom-burger.com
          </p>
        </div>
      </div>
    </div>
  );
}