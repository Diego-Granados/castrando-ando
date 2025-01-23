"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LostPetForms from "@/components/LostPetForms";
import LostPetController from "@/controllers/LostPetController";
import AuthController from "@/controllers/AuthController";
import { Container, Spinner } from "react-bootstrap";

export default function EditLostPetPage() {
  const [pet, setPet] = useState(null);
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
          router.push('/userLogin');
          return;
        }
        setIsAdmin(role === 'Admin');

        // Get lost pet data - using getLostPetByIdOnce since we don't need real-time updates
        const petData = await LostPetController.getLostPetByIdOnce(params.id);
        
        if (!petData) {
          setError('Publicación no encontrada');
          setLoading(false);
          return;
        }

        // Verify ownership
        if (petData.userId !== user.uid && role !== 'Admin') {
          router.push('/animales_perdidos');
          return;
        }

        setPet(petData);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    initialize();
  }, [params.id, router]);

  if (loading || !pet) {
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
    <LostPetForms
      isAdmin={isAdmin}
      initialData={pet}
      isEditing={true}
    />
  );
} 