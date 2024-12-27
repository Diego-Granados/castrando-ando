"use client";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AuthController from "@/controllers/AuthController";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function loginUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get("email");
    const password = formData.get("password");

    AuthController.userLogin(
      email,
      password,
      (user) => {
        // On success
        router.push("/");
      },
      (error) => {
        // On error
        console.log(error);
        toast.error("Usuario no existe o contraseña incorrecta.", {
          position: "top-center",
          autoClose: 8000,
          toastId: "login-admin",
        });
      }
    );
  }

  const handleResetPassword = async () => {
    try {
      await AuthController.resetPassword(resetEmail);
      toast.success("Se ha enviado un correo para restablecer su contraseña", {
        position: "top-center",
      });
      setShowResetModal(false);
    } catch (error) {
      toast.error(
        "Error al enviar el correo de restablecimiento de su contraseña.",
        {
          position: "top-center",
        }
      );
    }
  };

  return (
    <>
      <Form onSubmit={loginUser}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            autoComplete="username"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Ingrese su contraseña"
              name="password"
              autoComplete="current-password"
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
        <Button variant="primary" type="submit" className="w-100 mb-2">
          Ingresar
        </Button>
        <Button
          variant="link"
          className="w-100 text-decoration-none"
          onClick={() => setShowResetModal(true)}
        >
          ¿Olvidaste tu contraseña?
        </Button>
      </Form>

      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Restablecer Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Ingrese su correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Correo electrónico"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleResetPassword}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
