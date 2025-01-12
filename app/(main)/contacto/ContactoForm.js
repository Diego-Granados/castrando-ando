"use client";
import { Button, Form, FormGroup } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { sendEmail, sendMsg } from "@/lib/firebase/Brevo";
import { toast } from "react-toastify";
import { useState } from "react";
import ContactController from "@/controllers/ContactController";

export default function Contacto() {
  const router = useRouter();

  async function contactoData(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const rawFormData = {
      cedula: formData.get("cédula"),
      nombre: formData.get("nombre"),
      correo: formData.get("email"),
      mensaje: formData.get("msg"),
      fecha: new Date().toISOString(),
      leido: false
    };

    try {
      // Save to Firebase
      await ContactController.createContactRequest(rawFormData);

      // Send email if email is provided
      if (rawFormData.correo) {
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
          toast.error("Error al enviar el correo electrónico");
        }
      }
    } catch (error) {
      console.error("Error saving contact request:", error);
      toast.error("Error al guardar el mensaje");
    }
  }

  return (
    <Form onSubmit={contactoData}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Cédula</Form.Label>
        <Form.Control type="number" placeholder="Cédula" name="cédula" required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Nombre completo</Form.Label>
        <Form.Control type="text" placeholder="Nombre" name="nombre" required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control
          type="email"
          placeholder="Correo electrónico"
          name="email"
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicMessage">
        <Form.Label>Tu mensaje</Form.Label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          name="msg"
          rows="3"
          required
        ></textarea>
      </Form.Group>
      <Button variant="danger" type="submit">
        Enviar
      </Button>
    </Form>
  );
}
