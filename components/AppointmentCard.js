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
import { sendCancelEmail } from "@/lib/firebase/Brevo";
import InscriptionController from "@/controllers/InscriptionController";

export default function AppointmentCard({
  reservation,
  id,
  appointmentKey,
  appointments,
  setAppointments,
  name,
  setName,
}) {
  const datetime = new Date(
    reservation.date +
      "T" +
      (reservation.timeslot.length == 4 ? "0" : "") +
      reservation.timeslot
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
      ...reservation,
    });
    if (response.ok) {
      toast.success("Cita cancelada correctamente.");
      const cancelEmail = await sendCancelEmail(
        reservation.email,
        name,
        reservation.timeslot,
        reservation.date,
        reservation.campaign + " en " + reservation.place
      );
      if (cancelEmail.ok) {
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
    get(child(ref(db), `campaigns/${reservation.campaignId}`)).then(
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
      campaignId: reservation.campaignId,
      timeslot: reservation.timeslot,
    };

    const response = await InscriptionController.updateAppointment(rawFormData);
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
            <Card.Title>Cita para {reservation.pet}</Card.Title>
            <Badge bg={active ? "success" : "danger"}>
              {active ? "Pendiente" : "Pasada"}
            </Badge>
          </Stack>

          <Card.Text>
            Campaña: {reservation.campaign} <br />
            Lugar: {reservation.place} <br />
            Fecha:{" "}
            {dateFormat.format(new Date(`${reservation.date}T12:00:00Z`))}{" "}
            <br />
            Hora: {reservation.timeslot} <br />
            Animal: {reservation.animal ? "Perro" : "Gato"} <br />
            Sexo: {reservation.sex ? "Macho" : "Hembra"} <br />
            Precio: ₡{reservation.priceData.price}{" "}
            {reservation.priceSpecial && "+ cargo por situación especial"}{" "}
            <br />
            Teléfono de contacto: {reservation.phone}
            <br />
            Correo electrónico de contacto: {reservation.email}
          </Card.Text>
          <Link href={`/campaign?id=${reservation.campaignId}`}>
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
          <Modal.Title>Cancelar cita para {reservation.pet}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea cancelar la cita de las {reservation.timeslot}{" "}
          del día {dateFormat.format(new Date(`${reservation.date}T12:00:00Z`))}{" "}
          para {reservation.pet}?
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
          <Modal.Title>Editar cita para {reservation.pet}?</Modal.Title>
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
                    defaultValue={reservation.phone}
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
                    defaultValue={reservation.email}
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
                    defaultValue={reservation.pet}
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
                    defaultChecked={reservation.animal}
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
                    defaultChecked={!reservation.animal}
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
                    defaultChecked={reservation.sex}
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
                    defaultChecked={!reservation.sex}
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
                          : `Más de ${campaign.pricesData[index - 1].weight} kg`) +
                        ` (₡${price.price})`
                      }
                      name="price"
                      id="10kg"
                      required
                      value={JSON.stringify({
                        price: price.price,
                        weight: price.weight,
                      })}
                      defaultChecked={
                        reservation.priceData.price == price.price &&
                        reservation.priceData.weight == price.weight
                      }
                    />
                  ))}
                </Form.Group>
                <Form.Check
                  type="checkbox"
                  label={`¿Caso especial? (preñez, celo, piometra, perros XL, etc...)`}
                  name="priceSpecial"
                  id="especial"
                  defaultChecked={reservation.priceSpecial}
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
