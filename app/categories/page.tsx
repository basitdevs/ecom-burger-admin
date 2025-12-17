"use client";

import React, { useState, useEffect } from "react";
import { 
  RefreshCw, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Category } from "@/lib/db"; // Use interface from lib/db

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
  });

  // --- Fetch Data ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", name_ar: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ 
      name: category.name, 
      name_ar: category.name_ar || "" 
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("English Name is required");
      return;
    }

    setIsSubmitting(true);
    const method = editingId ? "PUT" : "POST";
    const body = JSON.stringify({
        id: editingId,
        ...formData
    });

    try {
      const res = await fetch("/api/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingId ? "Category updated" : "Category created");
        setIsDialogOpen(false);
        fetchCategories(); 
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Delete this category?")) return;

    try {
        const res = await fetch("/api/categories", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        
        if (res.ok) {
            toast.success("Category deleted");
            fetchCategories();
        } else {
            toast.error("Failed to delete");
        }
    } catch (error) {
        toast.error("Error deleting category");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.name_ar && c.name_ar.includes(searchTerm))
  );

  return (
    <div className="w-full min-h-screen bg-background p-6 font-sans text-foreground">
      {/* Header */}
      <div className="w-full bg-card p-6 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4 border border-border shadow-lg mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={fetchCategories} className="text-primary hover:text-foreground">
            Data Refresh <RefreshCw size={18} className={loading ? "animate-spin ml-2" : "ml-2"} />
          </Button>
          <div className="bg-muted border border-border rounded-sm px-6 py-2 text-sm font-bold min-w-[150px] text-center">
            Total: {categories.length}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search..." 
                className="pl-9 bg-card border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Button onClick={handleOpenAdd} className="w-full sm:w-auto">
            <Plus size={18} className="mr-2" /> Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden shadow-xl">
        <Table>
            <TableHeader className="bg-muted/50">
                <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-bold w-[100px]">ID</TableHead>
                    <TableHead className="font-bold">English Name</TableHead>
                    <TableHead className="font-bold text-right">Arabic Name</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">Loading...</TableCell>
                    </TableRow>
                ) : filteredCategories.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">No categories found.</TableCell>
                    </TableRow>
                ) : (
                    filteredCategories.map((category) => (
                        <TableRow key={category.id} className="border-border hover:bg-muted/50 transition-colors">
                            <TableCell className="font-medium">#{category.id}</TableCell>
                            <TableCell className="font-bold">{category.name}</TableCell>
                            <TableCell className="font-arabic text-right">{category.name_ar || "-"}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(category)}>
                                        <Pencil size={16} className="text-blue-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                                        <Trash2 size={16} className="text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{editingId ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name (English)</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-background border-border"
                        placeholder="e.g. Burgers"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name_ar">Name (Arabic)</Label>
                    <Input
                        id="name_ar"
                        dir="rtl"
                        value={formData.name_ar}
                        onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                        className="bg-background border-border"
                        placeholder="مثال: برجر"
                    />
                </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}