"use client";
import { useState } from "react";
import { Form, Button, InputGroup, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AuthController from "@/controllers/AuthController";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("La imagen no debe superar los 5MB", {
          position: "top-center",
        });
        e.target.value = null;
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, seleccione un archivo de imagen válido", {
          position: "top-center",
        });
        e.target.value = null;
        return;
      }
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const name = formData.get("name");
    const phone = formData.get("phone");
    const cedula = formData.get("cedula");

    try {
      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      let profileUrl = null;
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append("files", profileImage);
        imageFormData.append("path", `profiles/${Date.now()}`);

        const uploadResponse = await fetch("/api/storage/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen de perfil");
        }

        const urls = await uploadResponse.json();
        profileUrl = urls[0];
      }

      const result = await AuthController.register(
        email,
        password,
        name,
        phone,
        cedula,
        profileUrl
      );

      if (result.ok) {
        toast.success("¡Registro exitoso! Su sesión se ha iniciado.", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/");
      } else {
        if (profileUrl) {
          // Delete uploaded image if registration failed
          await fetch("/api/storage/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ urls: [profileUrl] }),
          });
        }
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
      setIsRegistering(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Nombre completo</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese su nombre completo"
          name="name"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="cedula">
        <Form.Label>Cédula</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese su número de cédula"
          name="cedula"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingrese su correo electrónico"
          name="email"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="phone">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Ingrese su número de teléfono"
          name="phone"
          required
        />
      </Form.Group>

      <Form.Group className="mb-4" controlId="profilePicture">
        <Form.Label>Foto de perfil (opcional)</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          name="profilePicture"
        />
        <Form.Text className="text-muted">
          Tamaño máximo: 5MB. Formatos permitidos: JPG, PNG, GIF
        </Form.Text>
        {previewUrl && (
          <div className="mt-2 text-center">
            <Image
              src={previewUrl}
              alt="Vista previa"
              style={{ maxHeight: "200px" }}
              thumbnail
            />
          </div>
        )}
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Contraseña</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Ingrese su contraseña"
            name="password"
            required
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="confirmPassword">
        <Form.Label>Confirmar contraseña</Form.Label>
        <InputGroup>
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirme su contraseña"
            name="confirmPassword"
            required
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            type="button"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        </InputGroup>
      </Form.Group>

      <div className="d-grid gap-2">
        <Button
          variant="primary"
          type="submit"
          disabled={isRegistering}
          className="mb-3"
        >
          {isRegistering ? "Registrando..." : "Registrarse"}
        </Button>
        <Link href="/userLogin" className="text-center">
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
      </div>
    </Form>
  );
}
