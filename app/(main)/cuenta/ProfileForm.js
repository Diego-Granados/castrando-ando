"use client";
import { useState } from "react";
import { Form, Button, Image, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AuthController from "@/controllers/AuthController";
import { CldUploadButton } from "next-cloudinary";
import { Row, Col } from "react-bootstrap";

export default function ProfileForm({ initialData }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileUrl, setProfileUrl] = useState(initialData.profileUrl);

  const handleUpload = async (result) => {
    try {
      if (result.event !== "success") return;

      const newProfileUrl = result.info.secure_url;
      setProfileUrl(newProfileUrl);

      // Update profile in Firebase with new image URL
      const updateData = {
        ...initialData,
        profileUrl: newProfileUrl,
      };

      const result2 = await AuthController.updateUserProfile(updateData);
      if (result2.ok) {
        toast.success("¡Foto de perfil actualizada con éxito!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error(result2.error, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("Error al actualizar la foto de perfil", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData(e.target);
      const updateData = {
        ...initialData,
        name: formData.get("name"),
        phone: formData.get("phone"),
        profileUrl: profileUrl,
      };

      const result = await AuthController.updateUserProfile(updateData);

      if (result.ok) {
        toast.success("¡Perfil actualizado con éxito!", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error(result.error, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProfileImage = async () => {
    try {
      await fetch("/api/storage/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: [profileUrl] }),
      });
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await AuthController.deleteAccount();
      if (result.ok) {
        if (profileUrl) {
          await deleteProfileImage();
        }
        toast.success("Cuenta eliminada con éxito", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/");
      } else {
        toast.error(result.error, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const handleImageRemoval = async () => {
    try {
      const updateData = {
        ...initialData,
        profileUrl: "",
      };
      const result = await AuthController.updateUserProfile(updateData);
      if (result.ok) {
        deleteProfileImage();
        setProfileUrl(null);
        toast.success("Foto de perfil eliminada", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Error al eliminar la foto", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          {profileUrl ? (
            <Image
              src={profileUrl}
              alt="Foto de perfil"
              roundedCircle
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="bg-secondary rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{ width: "150px", height: "150px" }}
            >
              <span className="text-white h1">
                {initialData.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="text-center mb-4">
          <Row>
            <Col className={`${profileUrl ? "text-end pe-5" : ""}`}>
              <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={handleUpload}
                options={{
                  maxFiles: 1,
                  resourceType: "image",
                  maxFileSize: 5000000, // 5MB
                  sources: ["local"],
                  styles: {
                    palette: {
                      window: "#FFFFFF",
                      windowBorder: "#90A0B3",
                      tabIcon: "#0078FF",
                      menuIcons: "#5A616A",
                      textDark: "#000000",
                      textLight: "#FFFFFF",
                      link: "#0078FF",
                      action: "#FF620C",
                      inactiveTabIcon: "#0E2F5A",
                      error: "#F44235",
                      inProgress: "#0078FF",
                      complete: "#20B832",
                      sourceBg: "#E4EBF1",
                    },
                  },
                }}
                className="btn btn-primary"
              >
                Cambiar foto de perfil
              </CldUploadButton>
            </Col>
            {profileUrl && (
              <Col className="text-start ps-5">
                <Button
                  variant="outline-danger"
                  type="button"
                  onClick={handleImageRemoval}
                >
                  Eliminar foto
                </Button>
              </Col>
            )}
          </Row>

          <Form.Text className="text-muted d-block mt-2">
            Tamaño máximo: 5MB. Formatos permitidos: JPG, PNG, GIF
          </Form.Text>
        </div>

        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su nombre completo"
            name="name"
            defaultValue={initialData.name}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="cedula">
          <Form.Label>Cédula</Form.Label>
          <Form.Control
            type="number"
            value={initialData.id}
            disabled
            readOnly
          />
          <Form.Text className="text-muted">
            La cédula no se puede modificar
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            value={initialData.email}
            disabled
            readOnly
          />
          <Form.Text className="text-muted">
            El correo electrónico no se puede modificar
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-4" controlId="phone">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Ingrese su número de teléfono"
            name="phone"
            defaultValue={initialData.phone}
            required
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit" disabled={isUpdating}>
            {isUpdating ? "Actualizando..." : "Actualizar perfil"}
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={() => setShowDeleteModal(true)}
          >
            Eliminar cuenta
          </Button>
        </div>
      </Form>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar su cuenta? Esta acción no se puede
          deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Eliminar cuenta
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
