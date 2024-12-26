"use client";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import AppointmentCard from "@/components/AppointmentCard";
import AuthController from "@/controllers/AuthController";
import InscriptionController from "@/controllers/InscriptionController";

export default function Appointments() {
  const [appointments, setAppointments] = useState(null);
  const [cedula, setCedula] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function setUser(user) {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
    } else {
      setName(cedula);
    }
  }
  async function getAppointments(event) {
    event.preventDefault();
    await InscriptionController.getAppointments(cedula, setAppointments);
    await AuthController.getUser(cedula, setUser);
  }

  return (
    <main className="container">
      <h1>Reservaciones</h1>
      <p>Ingrese su número cédula.</p>
      <Form onSubmit={getAppointments}>
        <Form.Group className="mb-3" controlId="inputCedula">
          <Form.Label className="fw-semibold fs-5">Cédula:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ejemplo: 112345678"
            name="cedula"
            required
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mb-3">
          Consultar
        </Button>
      </Form>
      {name && <h2>Citas de {name}</h2>}
      {appointments &&
        (Object.keys(appointments).length > 0 ? (
          Object.keys(appointments).map((appointment, index) => {
            if (appointments[appointment].enabled) {
              return (
                <AppointmentCard
                  key={index}
                  appointment={appointments[appointment]}
                  id={cedula}
                  appointmentKey={appointment}
                  appointments={appointments}
                  setAppointments={setAppointments}
                  name={name}
                  setName={setName}
                  phone={phone}
                  setPhone={setPhone}
                  email={email}
                  setEmail={setEmail}
                />
              );
            }
          })
        ) : (
          <h3>No tiene citas programadas</h3>
        ))}
    </main>
  );
}
