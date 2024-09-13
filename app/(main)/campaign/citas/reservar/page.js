"use client";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { ref, get, child, onValue } from "firebase/database";

export default function Reservar() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const timeslot = searchParams.get("hora");
  const [campaign, setCampaign] = useState(null);

  const router = useRouter();
  if (!campaignId) {
    router.push("/");
  }

  const [available, setAvailable] = useState(null);

  useEffect(() => {
    get(child(ref(db), `campaigns/${campaignId}`)).then((snapshot) => {
      setCampaign(snapshot.val());
    });

    const inscriptionsRef = ref(db, `inscriptions/${campaignId}/${timeslot}`);
    const unsubscribe = onValue(inscriptionsRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No data available");
        return;
      }
      const data = snapshot.val();

      setAvailable(data);
    });

    return () => unsubscribe();
  }, [db]);

  return (
    <main className="container row">
      <div class="col-lg-6 px-5">
        <h1>Sacar cita</h1>
        {campaign && (
          <Form>
            <legend className="fs-5">
              Sacar cita a las {timeslot} para {campaign.title} en{" "}
              {campaign.place} el día {campaign.date}
            </legend>
            <Form.Group className="mb-3" controlId="inputCedula">
              <Form.Label className="fw-semibold fs-5">Cédula</Form.Label>
              <Form.Control type="text" placeholder="Cédula" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="inputNombre">
              <Form.Label className="fw-semibold fs-5">
                Nombre completo
              </Form.Label>
              <Form.Control type="text" placeholder="Nombre completo" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="inputTelefono">
              <Form.Label className="fw-semibold fs-5">Teléfono</Form.Label>
              <Form.Control type="number" placeholder="Teléfono" />
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
                defaultChecked
                required
              />
              <Form.Check
                type="radio"
                label="Gato"
                name="flexAnimal"
                id="gato"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="genero">
              <Form.Label className="fw-semibold fs-5">
                Género de la mascota
              </Form.Label>
              <Form.Check
                type="radio"
                label="Macho"
                name="flexGenero"
                id="macho"
                defaultChecked
                required
              />
              <Form.Check
                type="radio"
                label="Hembra"
                name="flexGenero"
                id="hembra"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold fs-5">
                Peso de la mascota
              </Form.Label>
              <Form.Check
                type="radio"
                label="Hasta 10 kg (13000)"
                name="flexRadioDefault"
                id="10kg"
              />
              <Form.Check
                type="radio"
                label="Hasta 15 kg (16000)"
                name="flexRadioDefault"
                id="15kg"
              />
              <Form.Check
                type="radio"
                label="Hasta 20 kg (22000)"
                name="flexRadioDefault"
                id="20kg"
              />
              <Form.Check
                type="radio"
                label="Más de 20 kg (26000)"
                name="flexRadioDefault"
                id="+20kg"
              />
              <Form.Check
                type="radio"
                label="¿Caso especial? (preñez, celo, piometra, etc...) + 5000"
                name="flexRadioDefault"
                id="especial"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Reservar
            </Button>
          </Form>
        )}
      </div>
      <div class="col-lg-6">
        <img
          class="m-5 w-75 rounded align-self-center"
          src="https://pawsonwheels.pet/wp-content/uploads/2023/11/chjpdmf0zs9sci9pbwfnzxmvd2vic2l0zs8ymdizlta4l3jhd3bpegvsx29mzmljzv8xnv9wag90b19vzl9hx2rvz19ydw5uaw5nx3dpdghfb3duzxjfyxrfcgfya19lcf9mm2i3mdqyzc0znwjlltrlmtqtogzhny1ky2q2owq1yzqzzjlfmi5qc.webp?resize=800%2C533"
        ></img>
      </div>
    </main>
  );
}
