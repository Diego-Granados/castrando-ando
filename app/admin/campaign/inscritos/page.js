"use client";
import { Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { ref, get, child, onValue, update } from "firebase/database";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import { CircleX } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";

export default function Citas() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const [campaign, setCampaign] = useState(null);

  const router = useRouter();
  if (!campaignId) {
    console.log("HERE");
    router.push("/admin");
  }

  const [timeslots, setTimeslots] = useState(null);
  const sortedKeys = ["10:00", "11:00", "12:00", "13:00", "14:00"];
  useEffect(() => {
    get(child(ref(db), `campaigns/${campaignId}`)).then((snapshot) => {
      setCampaign(snapshot.val());
    });

    const inscriptionsRef = ref(db, `inscriptions/${campaignId}`);
    const unsubscribe = onValue(inscriptionsRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No data available");
        return;
      }
      const data = snapshot.val();
      console.log(data);

      setTimeslots(data);
    });

    return () => unsubscribe();
  }, [db]);

  const [showCancel, setShowCancel] = useState(false);
  const handleCloseCancel = () => setShowCancel(false);
  const handleShowCancel = () => setShowCancel(true);
  const [reservation, setReservation] = useState(null);

  async function cancelReservation() {
    const response = await fetch("/api/reservations/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formData: reservation,
      }),
    });
    if (response.ok) {
      toast.success("Cita cancelada correctamente.");
    } else {
      toast.error("Error al cancelar la cita.");
    }
    handleCloseCancel();
  }

  return (
    <main className="container">
      {campaign && (
        <>
          <h1>Inscripciones</h1>
          <h2>
            Ver lista de personas inscritas a la campaña {campaign.title} en{" "}
            {campaign.place} el día {campaign.date}
          </h2>
          <Accordion alwaysOpen>
            {timeslots &&
              sortedKeys.map((timeslot) => (
                <Accordion.Item key={timeslot} eventKey={timeslot}>
                  <Accordion.Header>
                    {timeslot} -{" "}
                    {"appointments" in timeslots[timeslot]
                      ? Object.keys(timeslots[timeslot]["appointments"]).filter(
                          (appId) => {
                            timeslots[timeslot]["appointments"][appId].enabled;
                          }
                        ).length
                      : "0"}{" "}
                    inscritos
                  </Accordion.Header>
                  <Accordion.Body>
                    {"appointments" in timeslots[timeslot] ? (
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Mascota</th>
                            <th>Especie</th>
                            <th>Sexo</th>
                            <th>Precio</th>
                            <th>Peso</th>
                            <th>¿Caso especial?</th>
                            <th>Pagado</th>
                            <th>Eliminar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(timeslots[timeslot]["appointments"]).map(
                            (inscriptionId, index) => {
                              const inscription =
                                timeslots[timeslot]["appointments"][
                                  inscriptionId
                                ];
                              if (inscription.enabled) {
                                return (
                                  <tr key={index}>
                                    <td>{inscription.id}</td>
                                    <td>{inscription.name}</td>
                                    <td>{inscription.phone}</td>
                                    <td>{inscription.pet}</td>
                                    <td>
                                      {inscription.animal ? "Perro" : "Gato"}
                                    </td>
                                    <td>
                                      {inscription.sex ? "Macho" : "Hembra"}
                                    </td>
                                    <td>{inscription.priceData.price}</td>
                                    <td>{inscription.priceData.weight}</td>
                                    <td>
                                      {inscription.priceSpecial ? "Sí" : "No"}
                                    </td>
                                    <td>
                                      <Form>
                                        <Form.Check
                                          type="checkbox"
                                          name="priceSpecial"
                                          id="especial"
                                          checked={inscription.paid}
                                          onChange={(e) => {
                                            const updates = {};
                                            updates[
                                              `inscriptions/${campaignId}/${timeslot}/appointments/${inscriptionId}/paid`
                                            ] = e.target.checked;
                                            update(ref(db), updates).then(
                                              () => {
                                                toast.success(
                                                  `Inscripción ${
                                                    e.target.checked
                                                      ? "marcada como pagada"
                                                      : "desmarcada como pagada"
                                                  }`
                                                );
                                                inscription.paid =
                                                  e.target.checked;
                                              }
                                            );
                                          }}
                                        />
                                      </Form>
                                    </td>
                                    <td>
                                      <button
                                        style={{ border: "none" }}
                                        onClick={(e) => {
                                          setReservation({
                                            name: inscription.name,
                                            pet: inscription.pet,
                                            timeslot: timeslot,
                                            date: campaign.date,
                                            id: inscription.id,
                                            appointmentKey: inscriptionId,
                                            campaignId: campaignId,
                                          });
                                          handleShowCancel();
                                        }}
                                        disabled={inscription.paid}
                                      >
                                        <CircleX color="red" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }
                            }
                          )}
                        </tbody>
                      </Table>
                    ) : (
                      <p>No hay inscritos para esta hora.</p>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
          </Accordion>
        </>
      )}
      {reservation && (
        <Modal show={showCancel} onHide={handleCloseCancel} centered>
          <Modal.Header closeButton>
            <Modal.Title>Cancelar cita para {reservation.pet}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Está seguro que desea cancelar la cita de {reservation.name} para
            su mascota {reservation.pet} para las {reservation.timeslot} del día{" "}
            {reservation.date}?
          </Modal.Body>
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
        </Modal>
      )}
    </main>
  );
}
