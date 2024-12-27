"use client";
import { useEffect, useState } from "react";
import AuthController from "@/controllers/AuthController";
import ProfileForm from "./ProfileForm";
import { Container, Card } from "react-bootstrap";
import RouteGuard from "@/components/RouteGuard";

export default function AccountPage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const { user } = await AuthController.getCurrentUser();
      const userSnapshot = await AuthController.getUserData(user.uid);
      setUserData(userSnapshot);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  return (
    <RouteGuard requiredRole="User">
      <Container className="my-5">
        <Card className="shadow">
          <Card.Body>
            <h2 className="text-center mb-4">Mi Cuenta</h2>
            {userData && <ProfileForm initialData={userData} />}
          </Card.Body>
        </Card>
      </Container>
    </RouteGuard>
  );
}
