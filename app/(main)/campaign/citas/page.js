"use client";
import { Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { ref, get, child, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "react-bootstrap/Table";

export default function Citas() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const [campaign, setCampaign] = useState(null);

  const router = useRouter();
  if (!campaignId) {
    router.push("/");
  }

  const [timeslots, setTimeslots] = useState(null);
  const [sortedKeys, setSortedKeys] = useState(null);

  useEffect(() => {
    get(child(ref(db), `campaigns/${campaignId}`)).then((snapshot) => {
      if (!snapshot.exists()) {
        console.log("No data available");
        return;
      }
      setCampaign(snapshot.val());
      const datetime = new Date(snapshot.val().date + "T" + "15:00:00");
      const today = new Date();
      const active = today <= datetime;
      if (!active) {
        router.push("/");
      }
    });

    const inscriptionsRef = ref(db, `inscriptions/${campaignId}`);
    const unsubscribe = onValue(inscriptionsRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No data available");
        return;
      }
      const data = snapshot.val();
      console.log(data);
      const keys = Object.keys(data);

      const sortedKeys = keys.sort((a, b) => {
        const [hourA, minuteA] = a.split(":").map(Number);
        const [hourB, minuteB] = b.split(":").map(Number);

        // Comparar horas
        if (hourA === hourB) {
          return minuteA - minuteB;
        } else {
          return hourA - hourB;
        }
      });
      setSortedKeys(sortedKeys);
      setTimeslots(data);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <main className="container">
      <h1>Sacar cita</h1>
      {campaign ? (
        <Table striped bordered hover>
          <caption>
            Sacar cita para {campaign.title} en {campaign.place} el día{" "}
            {campaign.date}
          </caption>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Citas disponibles</th>
              <th>Reservar</th>
            </tr>
          </thead>
          <tbody>
            {timeslots &&
              sortedKeys.map((timeslot) => {
                let [hours, minutes] = timeslot.split(":");
                hours = parseInt(hours) + 1;
                return (
                  <tr key={timeslot}>
                    <td>
                      {timeslot} - {`${hours}:00`}
                    </td>
                    <td>{timeslots[timeslot].available}</td>
                    <td>
                      <Link
                        href={`/campaign/citas/reservar?id=${campaignId}&hora=${timeslot}`}
                      >
                        <Button
                          variant="primary"
                          disabled={timeslots[timeslot].available === 0}
                          aria-label={`Reservar a las ${timeslot.split(":")[0]} horas en ${campaign.place} el día ${campaign.date}`}
                        >
                          AGENDAR CITA
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      ) : (
        <h2>No hay un campaña. Regrese al menú principal.</h2>
      )}
    </main>
  );
}
