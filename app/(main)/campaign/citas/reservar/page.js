"use client";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CampaignController from "@/controllers/CampaignController";
import InscriptionController from "@/controllers/InscriptionController";
import useSubscription from "@/hooks/useSubscription";
import AuthController from "@/controllers/AuthController";
import PetController from "@/controllers/PetController";
import PetSelector from "@/components/PetSelector";
import { Modal, Alert } from "react-bootstrap";

export default function Reservar() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const timeslot = searchParams.get("hora");
  const [campaign, setCampaign] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [userPets, setUserPets] = useState({});

  const router = useRouter();
  if (!campaignId || !timeslot) {
    router.push("/");
  }

  const [available, setAvailable] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        const { user, role } = await AuthController.getCurrentUser();
        if (role !== "User") {
          throw new Error("User is not an user.");
        }
        const userSnapshot = await AuthController.getUserData(user.uid);
        setUserData(userSnapshot);

        // Load user's pets
        const userPets = await PetController.getPetsOnce(user.uid);
        setUserPets(userPets);
      } catch (error) {
        console.log("Usuario no autenticado o es administrador");
      }
    }
    loadUserData();
  }, []);

  function setCampaignState(campaign) {
    const datetime = new Date(campaign.date + "T" + "15:00:00");
    const today = new Date();
    const active = today <= datetime;
    if (!active) {
      router.push("/");
    }
    setCampaign(campaign);
    // Parse weight field as number where possible
    campaign.pricesData = campaign.pricesData.map((price) => ({
      ...price,
      weight: isNaN(price.weight) ? price.weight : parseInt(price.weight),
    }));
  }

  useEffect(() => {
    CampaignController.getCampaignByIdOnce(campaignId, setCampaignState);
  }, []);

  const { loading, error } = useSubscription(() => {
    if (!campaignId || !timeslot) {
      return () => {};
    }
    return InscriptionController.getAvailableTimeslots(
      campaignId,
      timeslot,
      setAvailable
    );
  }, [campaignId, timeslot]);

  const [reserving, setReserving] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [formData, setFormData] = useState(null);

  const handlePetSelect = (id, pet) => {
    if (selectedPet?.id === id) {
      setSelectedPet(null);
      return;
    }

    setSelectedPet({ id, ...pet });
    // Auto-fill pet data
    const animalRadio = document.querySelector(
      `input[name="flexAnimal"][value="${pet.animal ? "perro" : "gato"}"]`
    );
    const sexRadio = document.querySelector(
      `input[name="flexSex"][value="${pet.sex ? "macho" : "hembra"}"]`
    );
    if (animalRadio) animalRadio.checked = true;
    if (sexRadio) sexRadio.checked = true;

    // Find and select the appropriate weight option
    const weightOptions = document.querySelectorAll('input[name="price"]');
    for (let option of weightOptions) {
      const priceData = JSON.parse(option.value);
      if (
        // Check if weight is a number and compare numerically
        (typeof priceData.weight === "number" &&
          pet.weight <= priceData.weight) ||
        // Check if weight is a string and matches pet type
        (typeof priceData.weight === "string" &&
          ((pet.animal === false &&
            priceData.weight.toLowerCase() === "gatos") ||
            (pet.animal === true &&
              priceData.weight.toLowerCase() === "perros")))
      ) {
        option.checked = true;
        break;
      }
    }

    // Set special price if applicable
    const specialCheck = document.querySelector('input[name="priceSpecial"]');
    if (specialCheck) specialCheck.checked = pet.priceSpecial;
  };

  async function handleCreateAccount(e) {
    e.preventDefault();
    setCreatingAccount(true);

    try {
      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      // Register user
      const result = await AuthController.register(
        formData.email,
        password,
        formData.name,
        formData.phone,
        formData.id
      );

      if (result.ok) {
        toast.success("¡Cuenta creada con éxito!", {
          position: "top-center",
          autoClose: 3000,
        });
        setShowAccountModal(false);
        // Continue with reservation
        await submitReservation(formData);
      } else {
        toast.error(result.error, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setCreatingAccount(false);
    }
  }

  async function submitReservation(data) {
    try {
      const authenticated = userData ? true : false;
      const response = await InscriptionController.reserveAppointment(
        data,
        authenticated
      );
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
        const data = await response.json();
        const emailResponse = data.emailResponse;
        if (emailResponse.ok) {
          toast.success("Confirmación enviada correctamente", {});
        } else {
          toast.error("Error al enviar confirmación");
        }
      } else {
        throw new Error("Error al reservar la cita");
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

    if (!userData) {
      setFormData(rawFormData);
      setShowAccountModal(true);
      setReserving(false);
      return;
    }

    await submitReservation(rawFormData);
  }

  const dateFormat = new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <main className="container w-100">
        <div className="px-2">
          <h1>Sacar cita</h1>
          {campaign && available && (
            <Form onSubmit={reserveAppointment}>
              <legend className="fs-5">
                Sacar cita a las {timeslot} para {campaign.title} en{" "}
                {campaign.place} el día{" "}
                {dateFormat.format(new Date(`${campaign.date}T12:00:00Z`))}
              </legend>
              <Form.Group className="mb-3" controlId="inputCedula">
                <Form.Label className="fw-semibold fs-5">Cédula</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Cédula"
                  name="id"
                  defaultValue={userData?.id}
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
                  defaultValue={userData?.name}
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
                  defaultValue={userData?.phone}
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
                  defaultValue={userData?.email}
                  required
                />
              </Form.Group>

              {userData && Object.keys(userPets).length > 0 && (
                <PetSelector
                  pets={userPets}
                  selectedPet={selectedPet}
                  onPetSelect={handlePetSelect}
                />
              )}

              <Form.Group className="mb-3" controlId="pet">
                <Form.Label className="fw-semibold fs-5">
                  Nombre de su mascota
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Mascota"
                  name="pet"
                  defaultValue={selectedPet?.name}
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
                  defaultChecked={selectedPet?.animal}
                  required
                  value={"perro"}
                />
                <Form.Check
                  type="radio"
                  label="Gato"
                  name="flexAnimal"
                  id="gato"
                  defaultChecked={selectedPet ? !selectedPet.animal : false}
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
                  defaultChecked={selectedPet?.sex}
                  required
                  value={"macho"}
                />
                <Form.Check
                  type="radio"
                  label="Hembra"
                  name="flexSex"
                  id="hembra"
                  defaultChecked={selectedPet ? !selectedPet.sex : false}
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
                    label={`${
                      typeof price.weight === "number"
                        ? price.weight !== 100
                          ? `Hasta ${price.weight} kg`
                          : `Más de ${campaign.pricesData[index - 1].weight} kg`
                        : price.weight // Display string category directly
                    }: ₡${price.price.toLocaleString()}`}
                    name="price"
                    id={`${price.weight}kg`}
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
                label={`¿Caso especial? (preñez, celo, piometra, perros XL, etc...) + ₡${campaign.priceSpecial}`}
                name="priceSpecial"
                id="especial"
                defaultChecked={selectedPet?.priceSpecial}
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
        <div className="d-flex justify-content-center">
          <img
            className="my-5 mx-3 w-75 rounded align-self-center"
            src="https://images.theconversation.com/files/625049/original/file-20241010-15-95v3ha.jpg?ixlib=rb-4.1.0&rect=4%2C12%2C2679%2C1521&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip"
          ></img>
        </div>
      </main>

      <Modal
        show={showAccountModal}
        onHide={() => {
          if (!creatingAccount) {
            setShowAccountModal(false);
            submitReservation(formData);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            ¿Desea crear una cuenta? Esto le permitirá:
            <ul className="mb-0">
              <li>Ver sus citas programadas</li>
              <li>Gestionar sus mascotas</li>
              <li>Reservar citas más fácilmente</li>
            </ul>
          </Alert>
          <Form onSubmit={handleCreateAccount}>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese una contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirme su contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={creatingAccount}
              >
                {creatingAccount ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setShowAccountModal(false);
                  submitReservation(formData);
                }}
                disabled={creatingAccount}
              >
                Continuar sin cuenta
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
