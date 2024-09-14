"use client";
import { Form, Button } from "react-bootstrap";
import { db } from "@/lib/firebase/config";
import { ref, child, get } from "firebase/database";
import { useState } from "react";
import ReservationCard from "@/components/ReservationCard";

export default function Reservaciones() {
  const [appointments, setAppointments] = useState(null);
  const [cedula, setCedula] = useState("118790544");
  const [name, setName] = useState("");
  async function getAppointments(event) {
    event.preventDefault();
    const dbRef = ref(db);

    get(child(dbRef, `/appointments/${cedula}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach((appointment) => {
          if (!data[appointment].enabled) delete data[appointment];
        });
        setAppointments(data);
      } else {
        setAppointments({});
      }
    });
    get(child(dbRef, `/users/${cedula}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setName(snapshot.val().name);
      } else {
        setName(cedula);
      }
    });
  }
  return (
    <main className="container">
      <h1>Reservaciones</h1>
      <p>Ingrese su número cédula.</p>
      <Form onSubmit={getAppointments}>
        <Form.Group className="mb-3" controlId="inputCedual">
          <Form.Label className="fw-semibold fs-5">Cédula:</Form.Label>
          <Form.Control
            type="number"
            placeholder="112345678"
            name="cedula"
            required
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Consultar
        </Button>
      </Form>
      {name && <h2>Citas de {name}</h2>}
      {appointments &&
        (Object.keys(appointments).length > 0 ? (
          Object.keys(appointments).map((appointment, index) => {
            if (appointments[appointment].enabled) {
              return (
                <ReservationCard
                  key={index}
                  reservation={appointments[appointment]}
                  id={cedula}
                  appointmentKey={appointment}
                  appointments={appointments}
                  setAppointments={setAppointments}
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
