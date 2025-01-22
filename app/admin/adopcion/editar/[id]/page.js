"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdoptionForms from "@/components/AdoptionForms";
import AdoptionController from "@/controllers/AdoptionController";
import AuthController from "@/controllers/AuthController";
import { Container, Spinner } from "react-bootstrap";

export default function EditAdoptionPage() {
  const [adoption, setAdoption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check user authorization
        const { user, role } = await AuthController.getCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }
        setIsAdmin(role === 'Admin');

        // Get adoption data - using getAdoptionByIdOnce since we don't need real-time updates
        const adoptionData = await AdoptionController.getAdoptionByIdOnce(params.id);
        
        if (!adoptionData) {
          setError('Publicación no encontrada');
          setLoading(false);
          return;
        }

        // Verify ownership
        if (adoptionData.userId !== user.uid && role !== 'Admin') {
          router.push('/admin/adopcion');
          return;
        }

        setAdoption(adoptionData);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    initialize();
  }, [params.id, router]);

  if (loading || !adoption) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <AdoptionForms
      isAdmin={isAdmin}
      initialData={adoption}
      isEditing={true}
    />
  );
} 