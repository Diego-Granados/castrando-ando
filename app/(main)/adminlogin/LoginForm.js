"use client";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "next/image";
import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  async function loginUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const rawFormData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log(rawFormData);

    signInWithEmailAndPassword(auth, rawFormData.email, rawFormData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log("SUCCESS");
        router.push("/admin");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("FAILURE");
        toast.error("Usuario no existe o contraseña incorrecta.", {
          position: "top-center",
          autoClose: 8000,
          toastId: "login-admin",
        });
      });
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
