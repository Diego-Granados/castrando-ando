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
import InscriptionController from "@/controllers/InscriptionController";
import CampaignController from "@/controllers/CampaignController";
import useSubscription from "@/hooks/useSubscription";
import { sendReminder } from "@/controllers/EmailSenderController";
import NotificationController from "@/controllers/NotificationController";

import styles from "./Checkbox.module.css";

export default function Inscritos() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const timeslot = searchParams.get("timeslot");
  const inscriptionId = searchParams.get("inscriptionId");

  const [campaign, setCampaign] = useState(null);

  const router = useRouter();
  if (!campaignId) {
    router.push("/admin");
  }

  useEffect(() => {
    console.log(timeslot, inscriptionId);
    if (timeslot && inscriptionId) {
      handleUpdateAttendance(campaignId, timeslot, inscriptionId, true, {});
    }
  }, [timeslot, inscriptionId]);

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
      toast.success("Cita cancelada correctamente.");
    } else {
      toast.error("Error al cancelar la cita.");
    }
    handleCloseCancel();
  }

  async function sendReminders() {
    let error = false;
    sortedKeys.map((timeslot) => {
      if (timeslots[timeslot]["appointments"]) {
        Object.keys(timeslots[timeslot]["appointments"]).map(
          async (inscriptionId, index) => {
            const inscription =
              timeslots[timeslot]["appointments"][inscriptionId];
            if (inscription.enabled) {
              if (inscription.email) {
                const email = inscription.email;
                const name = inscription.name;
                const hour = timeslot;
                const date = campaign.date;
                const campaignName = campaign.title;
                const recordatorioEmail = await sendReminder(
                  email,
                  name,
                  hour,
                  date,
                  campaignName
                );
                if (!recordatorioEmail.ok) {
                  error = true;
                  toast.error("Error al enviar recordatorio");
                }
              }
              console.log(inscription);
              if (inscription.id) {
                try {
                  await NotificationController.createNotification({
                    title: "¡Recordatorio de Cita!",
                    message: `Recuerda tu cita para ${campaign.title} el día ${campaign.date} a las ${timeslot}. Lugar: ${campaign.place}`,
                    type: "appointment_reminder",
                    link: `/appointments`,
                    userId: inscription.id,
                    campaignId: campaign.id
                  });
                } catch (notifError) {
                  error = true;
                  toast.error("Error al enviar notificación en la app");
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

  async function handleUpdateAttendance(
    campaignId,
    timeslot,
    inscriptionId,
    present,
    inscription
  ) {
    const response = await InscriptionController.updateAttendance(
      campaignId,
      timeslot,
      inscriptionId,
      present
    );
    if (response.ok) {
      toast.success(
        `Inscripción ${
          present ? "marcada como presente." : "desmarcada como presente."
        }`
      );
      inscription.present = present;
    } else {
      toast.error("Error al marcar la asistencia.");
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
                                            handleUpdateAttendance(
                                              campaignId,
                                              timeslot,
                                              inscriptionId,
                                              event.target.checked,
                                              inscription
                                            );
                                          }}
                                        />
                                      </Form>
                                    </td>
                                    <td>
                                      <button
                                        style={{ border: "none" }}
                                        onClick={(e) => {
                                          setAppointment({
                                            appointmentKey: inscriptionId,
                                            campaignId: campaignId,
                                            date: campaign.date,
                                            timeslot: timeslot,
                                            campaign: campaign.title,
                                            place: campaign.place,
                                            ...inscription,
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
          <Button className="mt-3" onClick={sendReminders}>
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
