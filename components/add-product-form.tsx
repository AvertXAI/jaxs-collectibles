"use client";

import { useState } from "react";
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
import { X } from "lucide-react";

export function AddProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [itemNumber, setItemNumber] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");

  const handleSaveDraft = () => {
    // Logic to save the form data as a draft to Supabase
    console.log("Saving draft...", { name, description, price, itemNumber, tags, notes, category });
  };

  const handleAddNewProduct = () => {
    // Logic to add the new product to the Supabase catalog
    console.log("Adding new product...", { name, description, price, itemNumber, tags, notes, category });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add new product information. Click 'Add New Product' when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="name" className="text-left md:text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="description" className="text-left md:text-right">
              Short Description
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="pictures" className="text-left md:text-right">
              Pictures
            </Label>
            <Input id="pictures" type="file" multiple className="col-span-3" />
          </div>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
             <Label htmlFor="price" className="text-left md:text-right">
              Price
            </Label>
            <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" />
          </div>
           <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="itemNumber" className="text-left md:text-right">
              Item #
            </Label>
            <Input id="itemNumber" value={itemNumber} onChange={(e) => setItemNumber(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="category" className="text-left md:text-right">
                Collectible Category
            </Label>
            <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="tv-shows">TV Shows</SelectItem>
                    <SelectItem value="movies">Movies</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="gambling">Gambling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="blob" className="text-left md:text-right">
              Blob Input
            </Label>
            <Input id="blob" type="file" className="col-span-3" />
          </div>
           <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="tags" className="text-left md:text-right">
              Tags
            </Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="col-span-3" placeholder="Comma-separated tags" />
          </div>
          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
            <Label htmlFor="notes" className="text-left md:text-right">
              Notes
            </Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
            </DialogClose>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleSaveDraft}>
                    Save Draft
                </Button>
                <Button type="submit" onClick={handleAddNewProduct}>
                    Add New Product
                </Button>
            </div>
        </DialogFooter>
         <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
