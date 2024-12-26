"use client";
import { Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import { CircleX } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import { sendRecordatorio } from "@/lib/firebase/Brevo";
import InscriptionController from "@/controllers/InscriptionController";
import CampaignController from "@/controllers/CampaignController";
import useSubscription from "@/hooks/useSubscription";

import styles from "./Checkbox.module.css";

export default function Inscritos() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const [campaign, setCampaign] = useState(null);

  const router = useRouter();
  if (!campaignId) {
    router.push("/admin");
  }

  const [timeslots, setTimeslots] = useState(null);
  const [sortedKeys, setSortedKeys] = useState(null);

  useEffect(() => {
    CampaignController.getCampaignByIdOnce(campaignId, setCampaign);
  }, []);

  const { loading, error } = useSubscription(() =>
    InscriptionController.getCampaignInscriptions(
      campaignId,
      setSortedKeys,
      setTimeslots
    )
  );

  const [showCancel, setShowCancel] = useState(false);
  const handleCloseCancel = () => setShowCancel(false);
  const handleShowCancel = () => setShowCancel(true);
  const [appointment, setAppointment] = useState(null);

  async function cancelAppointment() {
    const response = await InscriptionController.deleteAppointment(appointment);
    if (response.ok) {
      toast.success("Cita cancelada correctamente.");
    } else {
      toast.error("Error al cancelar la cita.");
    }
    handleCloseCancel();
  }

  async function enviarRecordatorio() {
    let error = false;
    sortedKeys.map((timeslot) => {
      if (timeslots[timeslot]["appointments"]) {
        Object.keys(timeslots[timeslot]["appointments"]).map(
          async (inscriptionId, index) => {
            const inscription =
              timeslots[timeslot]["appointments"][inscriptionId];
            if (inscription.enabled) {
              if (inscription.email) {
                const correo = inscription.email;
                const nombre = inscription.name;
                const hora = timeslot;
                const fecha = campaign.date;
                const titulo = campaign.title;
                const recordatorioEmail = await sendRecordatorio(
                  correo,
                  nombre,
                  hora,
                  fecha,
                  titulo
                );
                if (!recordatorioEmail.ok) {
                  error = true;
                  toast.error("Error al enviar recordatorio");
                }
              }
            }
          }
        );
      }
    });
    if (!error) {
      toast.success("Recordatorios enviados correctamente");
    }
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
                            return timeslots[timeslot]["appointments"][appId]
                              .enabled;
                          }
                        ).length
                      : "0"}{" "}
                    inscritos
                  </Accordion.Header>
                  <Accordion.Body>
                    {"appointments" in timeslots[timeslot] ? (
                      <div className="table-responsive">
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
                              <th>¿Ya llegó?</th>
                              <th>Eliminar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(
                              timeslots[timeslot]["appointments"]
                            ).map((inscriptionId, index) => {
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
                                          className={`${styles.customCheckbox}`}
                                          checked={inscription.present}
                                          onChange={async (event) => {
                                            const response =
                                              await InscriptionController.updateAttendance(
                                                campaignId,
                                                timeslot,
                                                inscriptionId,
                                                event.target.checked
                                              );
                                            if (response.ok) {
                                              toast.success(
                                                `Inscripción ${
                                                  event.target.checked
                                                    ? "marcada como presente."
                                                    : "desmarcada como presente."
                                                }`
                                              );
                                              inscription.present =
                                                event.target.checked;
                                            } else {
                                              toast.error(
                                                "Error al marcar la asistencia."
                                              );
                                            }
                                          }}
                                        />
                                      </Form>
                                    </td>
                                    <td>
                                      <button
                                        style={{ border: "none" }}
                                        onClick={(e) => {
                                          setAppointment({
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
                                        disabled={inscription.present}
                                      >
                                        <CircleX color="red" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }
                            })}
                          </tbody>
                        </Table>
                      </div>
                    ) : (
                      <p>No hay inscritos para esta hora.</p>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
          </Accordion>
          <Button className="mt-3" onClick={enviarRecordatorio}>
            Enviar recordatorio
          </Button>
        </>
      )}
      {appointment && (
        <Modal show={showCancel} onHide={handleCloseCancel} centered>
          <Modal.Header closeButton>
            <Modal.Title>Cancelar cita para {appointment.pet}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Está seguro que desea cancelar la cita de {appointment.name} para
            su mascota {appointment.pet} para las {appointment.timeslot} del día{" "}
            {appointment.date}?
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
              onClick={cancelAppointment}
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
