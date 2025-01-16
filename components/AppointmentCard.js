"use client";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { toast } from "react-toastify";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import { get, ref, child } from "firebase/database";
import { db } from "@/lib/firebase/config";
import Link from "next/link";
import InscriptionController from "@/controllers/InscriptionController";

export default function AppointmentCard({
  appointment,
  id,
  appointmentKey,
  appointments,
  setAppointments,
  name,
  setName,
  authenticated,
}) {
  const datetime = new Date(
    appointment.date +
      "T" +
      (appointment.timeslot.length == 4 ? "0" : "") +
      appointment.timeslot
  );
  const today = new Date();
  const active = today <= datetime;

  const [showCancel, setShowCancel] = useState(false);
  const handleCloseCancel = () => setShowCancel(false);
  const handleShowCancel = () => setShowCancel(true);

  async function cancelAppointment() {
    const response = await InscriptionController.deleteAppointment({
      id,
      appointmentKey,
      name,
      ...appointment,
    });
    if (response.ok) {
      toast.success("Cita cancelada correctamente.", {
        position: "top-center",
        autoClose: 5000,
        toastId: "cancel-appointment",
      });
      const data = await response.json();
      const emailResponse = data.emailResponse;
      if (emailResponse.ok) {
        toast.success("Cancelación enviada correctamente", {});
      } else {
        toast.error("Error al enviar cancelación");
      }
      const updated = { ...appointments };
      delete updated[appointmentKey];
      setAppointments(updated);
    } else {
      toast.error("Error al cancelar la cita.");
    }
    handleCloseCancel();
  }

  const [showEdit, setShowEdit] = useState(false);
  const [campaign, setCampaign] = useState(null);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => {
    get(child(ref(db), `campaigns/${appointment.campaignId}`)).then(
      (snapshot) => {
        setCampaign(snapshot.val());
      }
    );
    setShowEdit(true);
  };

  async function editAppointment(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const rawFormData = {
      name: formData.get("name"),
      pet: formData.get("pet"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      animal: formData.get("flexAnimal") == "perro" ? true : false,
      sex: formData.get("flexSex") == "macho" ? true : false,
      priceData: JSON.parse(formData.get("price")),
      priceSpecial: formData.get("priceSpecial") ? true : false,
      appointmentKey,
      id,
      campaignId: appointment.campaignId,
      timeslot: appointment.timeslot,
    };

    const response = await InscriptionController.updateAppointment(
      rawFormData,
      authenticated
    );
    if (response.ok) {
      toast.success("Cita actualizada correctamente.");
      const updated = { ...appointments };
      updated[appointmentKey] = {
        ...appointments[appointmentKey],
        ...rawFormData,
      };
      setAppointments(updated);
      setName(rawFormData.name);
    } else {
      toast.error("Error al actualizar la cita.");
    }

    handleCloseEdit();
  }

  const dateFormat = new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <Stack direction="horizontal" gap={3}>
            <Card.Title>Cita para {appointment.pet}</Card.Title>
            <Badge bg={active ? "success" : "danger"}>
              {active ? "Pendiente" : "Pasada"}
            </Badge>
          </Stack>

          <Card.Text>
            Campaña: {appointment.campaign} <br />
            Lugar: {appointment.place} <br />
            Fecha:{" "}
            {dateFormat.format(new Date(`${appointment.date}T12:00:00Z`))}{" "}
            <br />
            Hora: {appointment.timeslot} <br />
            Animal: {appointment.animal ? "Perro" : "Gato"} <br />
            Sexo: {appointment.sex ? "Macho" : "Hembra"} <br />
            Precio: ₡{appointment.priceData.price}{" "}
            {appointment.priceSpecial && "+ cargo por situación especial"}{" "}
            <br />
            Teléfono de contacto: {appointment.phone}
            <br />
            Correo electrónico de contacto: {appointment.email}
          </Card.Text>
          <Link href={`/campaign?id=${appointment.campaignId}`}>
            <Button variant="light">Ver campaña</Button>
          </Link>
          <Button
            variant="primary"
            className="px-3 mx-4"
            onClick={handleShowEdit}
            disabled={!active}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={handleShowCancel}
            disabled={!active}
          >
            Cancelar
          </Button>
        </Card.Body>
      </Card>
      <Modal show={showCancel} onHide={handleCloseCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar cita para {appointment.pet}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea cancelar la cita de las {appointment.timeslot}{" "}
          del día {dateFormat.format(new Date(`${appointment.date}T12:00:00Z`))}{" "}
          para {appointment.pet}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseCancel}
            className="px-5"
          >
            No
          </Button>
          <Button variant="danger" onClick={cancelAppointment} className="px-5">
            Sí
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar cita para {appointment.pet}?</Modal.Title>
        </Modal.Header>
        <Form id="editForm" onSubmit={editAppointment}>
          <Modal.Body>
            {campaign && (
              <>
                <Form.Group className="mb-3" controlId="inputNombre">
                  <Form.Label className="fw-semibold fs-5">
                    Nombre completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre completo"
                    name="name"
                    required
                    defaultValue={name}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="inputTelefono">
                  <Form.Label className="fw-semibold fs-5">
                    Teléfono de contacto
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Teléfono"
                    name="phone"
                    required
                    defaultValue={appointment.phone}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="inputEmail">
                  <Form.Label className="fw-semibold fs-5">
                    Correo electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Correo electrónico"
                    name="email"
                    required
                    defaultValue={appointment.email}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="pet">
                  <Form.Label className="fw-semibold fs-5">
                    Nombre de su mascota
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mascota"
                    name="pet"
                    required
                    defaultValue={appointment.pet}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="animal">
                  <Form.Label className="fw-semibold fs-5">
                    ¿Perro o gato?
                  </Form.Label>
                  <Form.Check
                    type="radio"
                    label="Perro"
                    name="flexAnimal"
                    id="perro"
                    defaultChecked={appointment.animal}
                    required
                    value={"perro"}
                  />
                  <Form.Check
                    type="radio"
                    label="Gato"
                    name="flexAnimal"
                    id="gato"
                    required
                    value={"gato"}
                    defaultChecked={!appointment.animal}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="genero">
                  <Form.Label className="fw-semibold fs-5">
                    Sexo de la mascota
                  </Form.Label>
                  <Form.Check
                    type="radio"
                    label="Macho"
                    name="flexSex"
                    id="macho"
                    defaultChecked={appointment.sex}
                    required
                    value={"macho"}
                  />
                  <Form.Check
                    type="radio"
                    label="Hembra"
                    name="flexSex"
                    id="hembra"
                    required
                    value={"hembra"}
                    defaultChecked={!appointment.sex}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold fs-5">
                    Peso de la mascota
                  </Form.Label>
                  {campaign.pricesData.map((price, index) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      label={
                        (price.weight != "100"
                          ? `Hasta ${price.weight} kg`
                          : `Más de ${
                              campaign.pricesData[index - 1].weight
                            } kg`) + ` (₡${price.price})`
                      }
                      name="price"
                      id="10kg"
                      required
                      value={JSON.stringify({
                        price: price.price,
                        weight: price.weight,
                      })}
                      defaultChecked={
                        appointment.priceData.price == price.price &&
                        appointment.priceData.weight == price.weight
                      }
                    />
                  ))}
                </Form.Group>
                <Form.Check
                  type="checkbox"
                  label={`¿Caso especial? (preñez, celo, piometra, perros XL, etc...)`}
                  name="priceSpecial"
                  id="especial"
                  defaultChecked={appointment.priceSpecial}
                />
                <Form.Text className="text-muted">
                  Si desea cambiar la hora de la cita, debe cancelar esta cita y
                  sacar una nueva.
                </Form.Text>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
