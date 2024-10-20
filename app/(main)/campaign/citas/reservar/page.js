"use client";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { sendConfirmationEmail } from "@/lib/firebase/Brevo";
import { ref, get, child, onValue } from "firebase/database";
import { toast } from "react-toastify";
export default function Reservar() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const timeslot = searchParams.get("hora");
  const [campaign, setCampaign] = useState(null);

  const router = useRouter();
  if (!campaignId || !timeslot) {
    router.push("/");
  }

  const [available, setAvailable] = useState(null);

  useEffect(() => {
    get(child(ref(db), `campaigns/${campaignId}`)).then((snapshot) => {
      if (!snapshot.exists()) {
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

    const inscriptionsRef = ref(db, `inscriptions/${campaignId}/${timeslot}`);
    const unsubscribe = onValue(inscriptionsRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      const data = snapshot.val();

      setAvailable(data);
    });

    return () => unsubscribe();
  }, [db]);

  const [reserving, setReserving] = useState(false);
  async function reserveAppointment(event) {
    event.preventDefault();

    setReserving(true);
    const formData = new FormData(event.target);
    const rawFormData = {
      id: formData.get("id"),
      name: formData.get("name"),
      pet: formData.get("pet"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      animal: formData.get("flexAnimal") == "perro" ? true : false,
      sex: formData.get("flexSex") == "macho" ? true : false,
      priceData: JSON.parse(formData.get("price")),
      priceSpecial: formData.get("priceSpecial") ? true : false,
      campaignId: campaignId,
      timeslot: timeslot,
      campaign: campaign.title,
      date: campaign.date,
      place: campaign.place,
    };

    try {
      const response = await fetch("/api/campaigns/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: rawFormData }),
      });

      if (response.ok) {
        toast.success("¡Cita reservada con éxito!", {
          position: "top-center",
          autoClose: 5000,
          toastId: "reserve-appointment",
          onClose: () => {
            setReserving(false);
            router.push("/");
          },
        });
      } else {
        toast.error("¡Error al reservar la cita!", {
          position: "top-center",
          autoClose: 8000,
          toastId: "reserve-appointment",
        });
        setReserving(false);
      }
      const confirmationEmail = await sendConfirmationEmail(
        rawFormData.email,
        rawFormData.name,
        rawFormData.timeslot,
        rawFormData.date,
        rawFormData.campaign + " en " + rawFormData.place
      );
      if (confirmationEmail.ok) {
        toast.success("Confirmación enviada correctamente", {});
      } else {
        toast.error("Error al enviar confirmación");
      }
    } catch (error) {
      toast.error("¡Error al reservar la cita!", {
        position: "top-center",
        autoClose: 8000,
        toastId: "reserve-appointment",
      });
      setReserving(false);
    }
  }

  return (
    <main className="container row">
      <div className="col-lg-6 px-5">
        <h1>Sacar cita</h1>
        {campaign && available && (
          <Form onSubmit={reserveAppointment}>
            <legend className="fs-5">
              Sacar cita a las {timeslot} para {campaign.title} en{" "}
              {campaign.place} el día {campaign.date}
            </legend>
            <Form.Group className="mb-3" controlId="inputCedula">
              <Form.Label className="fw-semibold fs-5">Cédula</Form.Label>
              <Form.Control
                type="number"
                placeholder="Cédula"
                name="id"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="inputNombre">
              <Form.Label className="fw-semibold fs-5">
                Nombre completo
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre completo"
                name="name"
                required
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
                defaultChecked
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
                defaultChecked
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
                />
              ))}
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="¿Caso especial? (preñez, celo, piometra, etc...) + ₡5000"
              name="priceSpecial"
              id="especial"
            />
            <Button
              className="mt-3"
              variant="primary"
              type="submit"
              disabled={!available.available || reserving}
            >
              Reservar
            </Button>
            <Form.Text className="text-muted px-4 fs-6">
              Quedan {available.available} campos.
            </Form.Text>
          </Form>
        )}
      </div>
      <div className="col-lg-6">
        <img
          className="m-5 w-75 rounded align-self-center"
          src="https://pawsonwheels.pet/wp-content/uploads/2023/11/chjpdmf0zs9sci9pbwfnzxmvd2vic2l0zs8ymdizlta4l3jhd3bpegvsx29mzmljzv8xnv9wag90b19vzl9hx2rvz19ydw5uaw5nx3dpdghfb3duzxjfyxrfcgfya19lcf9mm2i3mdqyzc0znwjlltrlmtqtogzhny1ky2q2owq1yzqzzjlfmi5qc.webp?resize=800%2C533"
        ></img>
      </div>
    </main>
  );
}
