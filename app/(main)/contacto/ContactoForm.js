"use client";
import Image from "next/image";
import { Button, Form, FormGroup } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function Contacto() {
    const router = useRouter()
    async function contactoData(event) {
        event.preventDefault();
        const rawFormData = {
            cedula: formData.get("cédula"),
            nombre: formData.get("nombre"),
            correo: formData.get("email"),
            mensaje: formData.get("msg"),
            notificaciones: formData.get("notis")
          };
      
          console.log(rawFormData);
        router.push("/")
    }

  return (
    <Form onSubmit={contactoData}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Cédula</Form.Label>
            <Form.Control type="text" placeholder="Cédula" name="cédula" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control type="text" placeholder="Nombre" name="nombre" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control type="email" placeholder="Correo electrónico" name="email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Tu mensaje</Form.Label>
            <textarea className="form-control" id="exampleFormControlTextarea1" name="msg" rows="3"></textarea>
        </Form.Group>
        <FormGroup className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1" name="notis"/>
            <Form.Label className="form-check-label" for="exampleCheck1">Quiero recibir notificaciones de futuras campañas</Form.Label>
        </FormGroup>
        <Button variant="danger" type="submit">
            Enviar
        </Button>
    </Form>
  );
}