"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdoptionForms from "@/components/AdoptionForms";
import AdoptionController from "@/controllers/AdoptionController";

export default function CreateAdoptionPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const result = await AdoptionController.createAdoption(formData);
      return result; // This will now return {success: true, message: "..."} directly
    } catch (error) {
      console.error("Error creating adoption post:", error);
      throw error; // Let the form component handle the error
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdoptionForms
      onSubmit={handleSubmit}
      isEditing={false}
    />
  );
} 