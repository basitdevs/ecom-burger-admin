"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RefreshCw, Edit, Trash2, Monitor, Plus, Tag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Removed CardContent/Footer to control padding manually
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Product, Category } from "@/lib/db";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (Array.isArray(prodData)) {
        setProducts(prodData);
        setFilteredProducts(prodData);
      }
      if (Array.isArray(catData)) setCategories(catData);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = products.filter(p =>
      (p.Title && p.Title.toLowerCase().includes(lowerQuery)) ||
      ((p as any).title && (p as any).title.toLowerCase().includes(lowerQuery))
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success("Product deleted");
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete");
      }
    } catch (e) {
      toast.error("Error deleting product");
    }
  };

  const getCategoryName = (id: number) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "Unknown";
  };

  return (
    <div className="w-full min-h-screen bg-background p-6 font-sans text-foreground">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your food catalog and inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card border border-border px-4 py-2 rounded-md shadow-sm hidden sm:block">
            <span className="text-sm font-medium text-muted-foreground">Total Items:</span>
            <span className="ml-2 font-bold text-foreground">{products.length}</span>
          </div>
          <Button variant="outline" size="icon" onClick={fetchData} className="hover:bg-muted">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </Button>
          <Link href="/products/add">
            <Button className="font-bold gap-2 shadow-md">
              <Plus size={18} /> Add Product
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Monitor size={20} />
          </div>
          <span className="font-semibold text-sm">All Products</span>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10 bg-background border-border h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-[380px] bg-muted/20 animate-pulse rounded-xl border border-border"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-card rounded-xl border border-dashed border-border">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Tag size={40} />
          </div>
          <p className="text-lg font-medium">No products found.</p>
          <p className="text-sm">Try adjusting your search or add a new product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const title = product.Title || (product as any).title || "Untitled";
            const titleAr = product.Title_ar || (product as any).title_ar || "";
            const price = product.price ? Number(product.price).toFixed(3) : "0.000";

            return (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20 p-0"
              >
                <div className="relative w-full aspect-[4/3] bg-muted/30 overflow-hidden">
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-black/70 hover:bg-black/80 text-white backdrop-blur-md border-none shadow-sm px-3 py-1 text-xs font-semibold">
                      {getCategoryName(product.categoryId)}
                    </Badge>
                  </div>
                  <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={product.image || "/placeholder.png"}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4 gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg leading-tight line-clamp-1 text-foreground" title={title}>
                      {title}
                    </h3>
                  </div>

                  <div className="mt-auto flex items-end justify-between border-t border-border/50 pt-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Price</p>
                      <p className="text-xl font-black text-primary">{price} <span className="text-xs font-medium text-muted-foreground">KWD</span></p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded border border-border/50 opacity-70">
                      ID: {product.id}
                    </span>
                  </div>
                </div>
                <div className="p-4 pt-0 grid grid-cols-2 gap-3">
                  <Link href={`/products/${product.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-border bg-background hover:bg-primary hover:text-white transition-all h-9 text-xs font-semibold shadow-sm">
                      <Edit size={14} className="mr-2" /> Edit
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
                    className="w-full border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive transition-colors h-9"
                  >
                    <Trash2 size={14} className="mr-2" /> Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}