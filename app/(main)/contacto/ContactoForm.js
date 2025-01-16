"use client";
import { Button, Form, FormGroup } from "react-bootstrap";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { useState } from "react";
import ContactController from "@/controllers/ContactController";
import Link from "next/link";

export default function Contacto() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("");

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);

    if (type === "Solicitud de campaña en zona") {
      alert(
        "¿Deseás que realicemos una campaña de castración en tu comunidad? Se deben contar con un salón comunal amplio y usted se encargará de ayudarnos con la organización."
      );
    }
  };

  async function contactoData(event) {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(form);

    const rawFormData = {
      idNumber: formData.get("idNumber"),
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      type: formData.get("type"),
      date: new Date().toISOString(),
      read: false,
    };
    try {
      const success = await ContactController.createContactRequest(rawFormData);
      if (success) {
        toast.success("Mensaje enviado correctamente", {
          onClose: () => {
            router.push("/");
          },
        });
      } else {
        console.error("Error al enviar el mensaje");
        toast.error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el mensaje");
    }
  }

  return (
    <Form onSubmit={contactoData}>
      <Form.Group className="mb-3" controlId="formBasicType">
        <Form.Label>Tipo de solicitud *</Form.Label>
        <Form.Select
          name="type"
          onChange={handleTypeChange}
          value={selectedType}
          required
        >
          <option value="">Seleccione un tipo</option>
          <option value="Consulta">Consulta</option>
          <option value="Sugerencia">Sugerencia</option>
          <option value="Solicitud de campaña en zona">
            Solicitud de campaña en zona
          </option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          Por favor seleccione un tipo de solicitud
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicIdNumber">
        <Form.Label>Cédula *</Form.Label>
        <Form.Control
          type="number"
          placeholder="Cédula"
          name="idNumber"
          required
          min="100000000"
          max="999999999"
        />
        <Form.Control.Feedback type="invalid">
          Por favor ingrese un número de cédula válido
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Nombre completo *</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nombre"
          name="name"
          required
          minLength={3}
        />
        <Form.Control.Feedback type="invalid">
          Por favor ingrese su nombre completo
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Correo electrónico *</Form.Label>
        <Form.Control
          type="email"
          placeholder="Correo electrónico"
          name="email"
          required
        />
        <Form.Control.Feedback type="invalid">
          Por favor ingrese un correo electrónico válido
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicMessage">
        <Form.Label>Tu mensaje *</Form.Label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          name="message"
          rows="3"
          required
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
