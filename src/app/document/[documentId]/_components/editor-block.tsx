"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation"; // Use this for navigation in Next.js 13
import { useToast } from "@/components/ui/use-toast";
import DrawerAI from "./drawer-ai";

interface DocumentProps {
  id: string;
  userId: string;
  title: string | null;
  description: string | null;
  createAt: Date;
  updateAt: Date;
}

const EditorBlock = ({ document }: { document?: DocumentProps | null }) => {
  const { toast } = useToast();
  const router = useRouter(); // Initialize router for client-side navigation

  const [title, setTitle] = useState(document?.title || "");
  const [description, setDescription] = useState(document?.description || "");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  // Redirect logic moved AFTER the hooks
  if (!document) {
    router.push("/"); // Redirect to home page if no document
    return null; // Don't render the component
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({}); // Clear any previous errors

    let hasError = false;
    const newErrors: { title?: string; description?: string } = {};

    if (title.trim().length < 2 || title.trim().length > 50) {
      newErrors.title = "Title must be between 2 and 50 characters.";
      hasError = true;
    }

    if (description.trim().length < 2) {
      newErrors.description = "Description must be at least 2 characters.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.put(`/api/document/${document?.id}`, {
        title,
        description,
      });
      router.push(`/document/${document?.id}`);
      if (res.status === 200) toast({ title: "Document Successfully Updated" });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating document",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  async function onDelete() {
    try {
      const res = await axios.delete(`/api/document/${document?.id}`);
      router.push("/");
      if (res.status === 200) toast({ title: "Document Successfully Deleted" });

      // Redirect to document list after successful deletion
    } catch (error) {
      console.error(error);
      toast({
        title: "Error deleting document",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-end mb-4 space-x-4">
        <DrawerAI description={description} />
        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <Input
            id="title"
            placeholder="Enter Title here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter Description here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full h-40 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditorBlock;
