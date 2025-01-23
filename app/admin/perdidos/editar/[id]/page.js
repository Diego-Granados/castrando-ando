"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LostPetForms from "@/components/LostPetForms";
import LostPetController from "@/controllers/LostPetController";
import AuthController from "@/controllers/AuthController";
import { Container, Spinner } from "react-bootstrap";

export default function AdminEditLostPetPage() {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check user authorization
        const { user } = await AuthController.getCurrentUser();
        if (!user) {
          router.push('/adminlogin');
          return;
        }

        // Get lost pet data
        const petData = await LostPetController.getLostPetByIdOnce(params.id);
        
        if (!petData) {
          setError('Publicación no encontrada');
          setLoading(false);
          return;
        }

        // Verify ownership - in admin page we only check if the user owns the post
        if (petData.userId !== user.uid) {
          router.push('/admin/perdidos');
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
      isAdmin={true}
      initialData={pet}
      isEditing={true}
    />
  );
}
