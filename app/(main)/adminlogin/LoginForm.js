"use client";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import AuthController from "@/controllers/AuthController";

export default function LoginForm() {
  const router = useRouter();

  async function loginUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get("email");
    const password = formData.get("password");

    AuthController.adminLogin(
      email,
      password,
      (user) => {
        // On success
        router.push("/admin");
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

  return (
    <Form onSubmit={loginUser}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control type="email" placeholder="Enter email" name="email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" placeholder="Password" name="password" />
      </Form.Group>
      <Button variant="primary" type="submit" className="w-100">
        Ingresar
      </Button>
    </Form>
  );
}
