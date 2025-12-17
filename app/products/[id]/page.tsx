"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Image as ImageIcon, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Category } from "@/lib/db";

export default function ProductFormPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isEditing = id !== "add";

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(isEditing);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        Title: "",
        Title_ar: "",
        price: "",
        image: "",
        categoryId: "",
    });

    useEffect(() => {
        const initData = async () => {
            try {
                // Fetch Categories
                const catRes = await fetch("/api/categories");
                const catData = await catRes.json();
                if (Array.isArray(catData)) setCategories(catData);

                // Fetch Product if Editing
                if (isEditing) {
                    const prodRes = await fetch(`/api/products/${id}`);
                    if (!prodRes.ok) throw new Error("Product not found");
                    const product = await prodRes.json();

                    // FIX: Handle potential case sensitivity from DB response
                    setFormData({
                        Title: product.Title || product.title || "",
                        Title_ar: product.Title_ar || product.title_ar || "",
                        price: product.price ? product.price.toString() : "",
                        image: product.image || "",
                        categoryId: product.categoryId ? product.categoryId.toString() : "",
                    });
                }
            } catch (e) {
                toast.error("Error loading data");
                if (isEditing) router.push("/products");
            } finally {
                setDataLoading(false);
            }
        };

        initData();
    }, [id, isEditing, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.Title || !formData.price || !formData.categoryId) {
            toast.error("Please fill required fields (English Title, Price, Category)");
            return;
        }

        setLoading(true);
        try {
            const method = isEditing ? "PUT" : "POST";
            const body = isEditing ? { ...formData, id: parseInt(id) } : formData;

            const res = await fetch("/api/products", {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.success) {
                toast.success(isEditing ? "Product updated successfully!" : "Product created successfully!");
                router.push("/products");
                router.refresh();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-background text-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-background p-6 font-sans text-foreground">
            {/* Header */}
            <div className="w-full bg-card p-6 rounded-sm flex items-center justify-between border border-border shadow-lg mb-8">
                <h1 className="text-2xl font-bold tracking-tight">
                    {isEditing ? `Edit Product #${id}` : "Add New Product"}
                </h1>
                <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
                    <X size={20} className="mr-2" /> Cancel
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN - IMAGE PREVIEW */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h3 className="font-semibold mb-4">Product Image</h3>
                        <div className="w-full aspect-square border-2 border-dashed border-border bg-muted/20 rounded-lg flex flex-col items-center justify-center overflow-hidden relative">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <ImageIcon size={40} className="mb-2 opacity-50" />
                                    <span className="text-xs font-medium">No image preview</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <Label className="text-muted-foreground text-xs mb-2 block">Image URL</Label>
                            <Input
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.png"
                                className="bg-background border-border"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - DETAILS */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                        <h3 className="font-semibold border-b border-border pb-4">General Information</h3>

                        <div className="space-y-2">
                            <Label>Product Title (English) *</Label>
                            <Input
                                name="Title" // Match the state key
                                value={formData.Title}
                                onChange={handleChange}
                                placeholder="e.g. Classic Beef Burger"
                                className="bg-background border-border"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-right block">اسم المنتج (Arabic)</Label>
                            <Input
                                name="Title_ar"
                                dir="rtl"
                                value={formData.Title_ar}
                                onChange={handleChange}
                                placeholder="مثال: برجر لحم كلاسيك"
                                className="bg-background border-border"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Category *</Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                                >
                                    <SelectTrigger className="bg-background border-border">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>
                                                {cat.name} {cat.name_ar ? `(${cat.name_ar})` : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Price (KWD) *</Label>
                                <Input
                                    name="price"
                                    type="number"
                                    step="0.050"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.000"
                                    className="bg-background border-border"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button onClick={() => router.back()} variant="outline">Cancel</Button>
                        <Button onClick={handleSubmit} disabled={loading} className="font-bold px-8">
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : (
                                <><Save className="mr-2 h-4 w-4" /> {isEditing ? "Update Product" : "Save Product"}</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}