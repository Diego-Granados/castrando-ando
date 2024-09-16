"use client";
import { Button, Form, FormGroup } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { sendEmail } from "@/lib/firebase/Brevo";
import { toast } from "react-toastify";

export default function Contacto() {
  const router = useRouter();
  async function contactoData(event) {
    const formData = new FormData(event.target);
    event.preventDefault();
    const rawFormData = {
      cedula: formData.get("cédula"),
      nombre: formData.get("nombre"),
      correo: formData.get("email"),
      mensaje: formData.get("msg"),
      notificaciones: formData.get("notis"),
    };

    //Mandar correos, se debe mandar el correo a la asociacion, pero por ahora me lo mando a mi
    if (rawFormData.correo !== "") {
      console.log(rawFormData);
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
        <Form.Control type="text" placeholder="Cédula" name="cédula" />
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
      <FormGroup className="mb-3 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="exampleCheck1"
          name="notis"
        />
        <Form.Label className="form-check-label" htmlFor="exampleCheck1">
          Quiero recibir notificaciones de futuras campañas
        </Form.Label>
      </FormGroup>
      <Button variant="danger" type="submit">
        Enviar
      </Button>
    </Form>
  );
}
