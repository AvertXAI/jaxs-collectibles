//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
// File: components/admin/add-product-form.tsx
//////////////////////////////////////////////////
"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/components/supabase-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2, Plus, ShieldCheck } from "lucide-react";

export function AddProductForm() {
  const supabase = useSupabase();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
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
        if (profile?.role === "admin" || profile?.role === "owner") setIsAdmin(true);
      }
    };
    if (supabase) checkUser();
  }, [supabase]);

  const handleAddNewProduct = async () => {
    if (!name || !price) return alert("Name and Price are required.");
    setIsSubmitting(true);

    try {
      let finalImageUrl = "/logo.png"; // Fallback image

      // 1. If there is an image, upload it to Supabase Storage first
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `vault-assets/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error("Storage Upload Failed:", uploadError);
          throw new Error("Failed to upload image to Vault Storage.");
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // 2. Generate a clean URL slug from the name
      const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // 3. Insert directly into the products table
      const { error: dbError } = await supabase
        .from('products')
        .insert({
          name: name,
          slug: generatedSlug,
          description: description || "Classified Vault Asset",
          price: parseFloat(price),
          category: category || "General",
          stock: 1, // Default stock
          images: [finalImageUrl], // Store as JSON array to match current schema
          image_url: finalImageUrl // Fallback string
        });

      if (dbError) throw dbError;

      alert("Success! Asset secured in the Vault.");
      setName(""); setDescription(""); setPrice(""); setCategory(""); setImageFile(null); // Reset Form
      setOpen(false); // Close the modal
      window.location.reload(); // Refresh to show the new item

    } catch (err: any) {
      console.error(err);
      alert(`Vault Error: ${err.message || "Database synchronization failed."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not admin, don't show the component at all
  if (!isAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* THE FIX: Unified standardized secondary header button style */}
        <Button className="flex items-center gap-2 bg-[#590202] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#D9B36C] hover:text-[#1B263B] transition-all shadow-lg border-0 h-auto">
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] bg-[#FDFBF7] border border-[#D9B36C]/30 text-[#1B263B]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic text-[#590202] uppercase tracking-tighter">Secure New Asset</DialogTitle>
          <DialogDescription className="text-[#1B263B]/60 font-bold text-xs uppercase tracking-widest">Enter intelligence details below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/60 ml-2">Asset Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-white border-[#D9B36C]/20 rounded-xl h-12" placeholder="e.g. 1st Ed. Charizard" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/60 ml-2">Price ($)</Label>
              <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-white border-[#D9B36C]/20 rounded-xl h-12" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/60 ml-2">Category Sector</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="bg-white border-[#D9B36C]/20 rounded-xl h-12">
                  <SelectValue placeholder="Assign Sector" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#D9B36C]/30">
                  <SelectItem value="TCG / Cards">TCG / Cards</SelectItem>
                  <SelectItem value="First Edition Comics">First Edition Comics</SelectItem>
                  <SelectItem value="Statues & Figures">Statues & Figures</SelectItem>
                  <SelectItem value="Instruments">Instruments</SelectItem>
                  <SelectItem value="Exclusive">Exclusive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pictures" className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/60 ml-2">Visual Intel (Image)</Label>
            <Input
              id="pictures"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="bg-white border-[#D9B36C]/20 rounded-xl pt-3 cursor-pointer h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-[#1B263B]/60 ml-2">Asset Intelligence (Description)</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-white border-[#D9B36C]/20 rounded-xl min-h-[100px]" placeholder="Enter condition, origin, and verification details..." />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleAddNewProduct} disabled={isSubmitting} className="w-full bg-[#590202] text-white hover:bg-[#1B263B] font-black uppercase tracking-widest rounded-xl h-14 shadow-lg transition-all mt-4">
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
            {isSubmitting ? "SECURING IN VAULT..." : "AUTHORIZE & SECURE ASSET"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}