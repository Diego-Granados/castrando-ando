"use client";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import AppointmentCard from "@/components/AppointmentCard";
import AuthController from "@/controllers/AuthController";
import InscriptionController from "@/controllers/InscriptionController";

export default function Appointments() {
  const [appointments, setAppointments] = useState(null);
  const [cedula, setCedula] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  function setUser(user) {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
    } else {
      setName(cedula);
    }
  }

  useEffect(() => {
    async function loadUserData() {
      try {
        const { user, role } = await AuthController.getCurrentUser();
        if (role !== "User") {
          throw new Error("User is not an user.");
        }
        const userSnapshot = await AuthController.getUserData(user.uid);
        setCedula(userSnapshot.id);
        setName(userSnapshot.name);
        setPhone(userSnapshot.phone);
        setEmail(userSnapshot.email);
        setAuthenticated(true);
      } catch (error) {
        console.log("Usuario no autenticado o es administrador");
      }
    }
    loadUserData();
  }, []);

  useEffect(() => {
    if (cedula) {
      getAppointments(cedula);
    }
  }, [cedula]);

  async function getAppointments(id) {
    await InscriptionController.getAppointments(id, setAppointments);
    await AuthController.getUser(id, setUser);
  }

  async function handleAppointments(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const cedulaValue = formData.get("cedula");
    setCedula(cedulaValue);
  }

  return (
    <main className="container">
      <h1>Reservaciones</h1>
      <p>Ingrese su número cédula.</p>
      <Form onSubmit={handleAppointments}>
        <Form.Group className="mb-3" controlId="inputCedula">
          <Form.Label className="fw-semibold fs-5">Cédula:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ejemplo: 112345678"
            name="cedula"
            required
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
                  authenticated={authenticated}
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
