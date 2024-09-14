"use client";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { toast } from "react-toastify";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
export default function ReservationCard({
  reservation,
  id,
  appointmentKey,
  appointments,
  setAppointments,
}) {
  const [showCancel, setShowCancel] = useState(false);

  const handleCloseCancel = () => setShowCancel(false);
  const handleShowCancel = () => setShowCancel(true);
  const datetime = new Date(reservation.date + "T" + reservation.timeslot);
  const today = new Date();
  const active = today <= datetime;
  console.log(active);
  async function cancelReservation() {
    const currentDate = new Date();
    if (currentDate > datetime) {
      toast.error("No se puede cancelar una cita pasada.");
    } else {
      const response = await fetch("/api/reservations/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: { id, appointmentKey, ...reservation },
        }),
      });
      if (response.ok) {
        toast.success("Cita cancelada correctamente.");
        const updated = { ...appointments };
        delete updated[appointmentKey];
        setAppointments(updated);
      } else {
        toast.error("Error al cancelar la cita.");
      }
    }
    handleCloseCancel();
  }

  const [showEdit, setShowEdit] = useState(false);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  async function editReservation() {
    const currentDate = new Date();
    // if (currentDate > datetime) {
    //   toast.error("No se puede cancelar una cita pasada.");
    // } else {
    //   const response = await fetch("/api/reservations/cancel", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       formData: { id, appointmentKey, ...reservation },
    //     }),
    //   });
    //   if (response.ok) {
    //     toast.success("Cita cancelada correctamente.");
    //     const updated = { ...appointments };
    //     delete updated[appointmentKey];
    //     setAppointments(updated);
    //   } else {
    //     toast.error("Error al cancelar la cita.");
    //   }
    // }
    handleCloseCancel();
  }

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
            Fecha: {reservation.date} <br />
            Hora: {reservation.timeslot} <br />
            Animal: {reservation.animal ? "Perro" : "Gato"} <br />
            Sexo: {reservation.sex ? "Macho" : "Hembra"} <br />
            Precio: ₡{reservation.priceData.price}{" "}
            {reservation.priceSpecial && "+ cargo por situación especial"}
          </Card.Text>
          <Button
            variant="primary"
            className="px-3 mx-4"
            onClick={handleShowEdit}
            disabled={active}
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
          <Modal.Title>Cancelar cita para {reservation.pet}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea cancelar la cita de las {reservation.timeslot}{" "}
          del día {reservation.date} para {reservation.pet}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseCancel}
            className="px-5"
          >
            No
          </Button>
          <Button variant="danger" onClick={cancelReservation} className="px-5">
            Sí
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit} centered>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>Editar cita para {reservation.pet}?</Modal.Title>
          </Modal.Header>
          <Modal.Body></Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseCancel}
              className="px-5"
            >
              No
            </Button>
            <Button
              variant="danger"
              onClick={cancelReservation}
              className="px-5"
            >
              Sí
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
