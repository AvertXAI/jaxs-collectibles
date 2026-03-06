"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Loader2, Plus } from "lucide-react";

export function AddProductForm() {
  // FIX: Added the missing state variables
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [itemNumber, setItemNumber] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // THE ADMIN GATE: Check if user is an admin on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile?.role === "admin") setIsAdmin(true);
      }
    };
    checkUser();
  }, []);

  const handleAddNewProduct = async () => {
    if (!name || !price) return alert("Name and Price are required.");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("itemNumber", itemNumber);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("notes", notes);
    formData.append("stock", "1");
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await fetch("/api/add-product", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Success! Added to Vault.");
        window.location.reload();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      alert("Failed to connect to the Vault.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not admin, don't show the component at all
  if (!isAdmin) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="border border-white/20 px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription className="text-zinc-400">Enter collectible details below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-zinc-900 border-zinc-800" />
          </div>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="pictures">Picture</Label>
            <Input
              id="pictures"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="col-span-3 bg-zinc-900 border-zinc-800"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3 bg-zinc-900 border-zinc-800" />
          </div>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="col-span-3 bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="tv-shows">TV Shows</SelectItem>
                <SelectItem value="movies">Movies</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 bg-zinc-900 border-zinc-800" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddNewProduct} disabled={isSubmitting} className="w-full bg-white text-black hover:bg-purple-600 hover:text-white font-black italic">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "ADDING TO VAULT..." : "ADD NEW PRODUCT"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}