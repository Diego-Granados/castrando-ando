"use client";
import { Button, Form, FormGroup } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { sendEmail, sendMsg } from "@/lib/firebase/Brevo";
import { toast } from "react-toastify";
import { useState } from "react";
import Link from "next/link";

export default function Contacto() {
  const router = useRouter();
  //const [whatsappLink, setWhatsappLink] = useState("")
  async function contactoData(event) {
    const formData = new FormData(event.target);
    event.preventDefault();
    const rawFormData = {
      cedula: formData.get("cédula"),
      nombre: formData.get("nombre"),
      //telefono: "506" + formData.get("telefono"),
      correo: formData.get("email"),
      mensaje: formData.get("msg"),
      notificaciones: formData.get("notis"),
    };

    //Mandar correos, se debe mandar el correo a la asociacion, pero por ahora me lo mando a mi
    if (rawFormData.correo !== "") {
      const response = await sendEmail(
        rawFormData.mensaje,
        rawFormData.correo,
        rawFormData.nombre,
        rawFormData.cedula
      );
      if (response.ok) {
        toast.success("Mensaje enviado correctamente", {
          onClose: () => {
            router.push("/");
          },
        });
      } else {
        toast.error("Error al enviar mensaje");
      }
    }
  }

  return (
    <Form onSubmit={contactoData}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Cédula</Form.Label>
        <Form.Control type="number" placeholder="Cédula" name="cédula" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Nombre completo</Form.Label>
        <Form.Control type="text" placeholder="Nombre" name="nombre" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control
          type="email"
          placeholder="Correo electrónico"
          name="email"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Tu mensaje</Form.Label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          name="msg"
          rows="3"
        ></textarea>
      </Form.Group>
      <div className="d-flex justify-content-between">
        <Button variant="danger" type="submit">
          Enviar
        </Button>
        <Link href="/contacto/solicitudes">
          <Button variant="outline-primary">Ver solicitudes</Button>
        </Link>
      </div>
    </Form>
  );
}
