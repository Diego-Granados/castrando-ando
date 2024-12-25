"use client";
import { Form, Button, Container, Row, Col, Text } from "react-bootstrap";
import { useState, useRef } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";
import Price from "@/components/Price";
import Requirement from "@/components/Requirement";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import CampaignController from "@/controllers/CampaignController";
import { fileToBase64 } from "@/utils/fileUtils";
function CreateForm() {
  const router = useRouter();
  const today = new Date();
  today.setDate(today.getDate() + 1); // Add 1 day to the current date
  const tomorrow = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  const [prices, setPrices] = useState([
    <Price key={0} id={0} price={13000} weight={10} />,
    <Price key={1} id={1} price={16000} weight={15} />,
    <Price key={2} id={2} price={22000} weight={20} />,
    <Price key={3} id={3} price={26000} weight={100} />,
  ]);

  const [reqs, setReqs] = useState([
    <Requirement
      key={0}
      defaultRequirement={"Perros y gatos en perfecto estado de salud."}
    />,
    <Requirement
      key={1}
      defaultRequirement={
        "Solo animales con 12 horas de ayuno (comida y agua)."
      }
    />,
    <Requirement key={2} defaultRequirement={"Llevar cobija."} />,
    <Requirement
      key={3}
      defaultRequirement={"Perros y gatos mayores de 3 meses."}
    />,
  ]);

  function addPrices() {
    setPrices(prices.concat(<Price key={prices.length} id={prices.length} />));
  }

  function deletePrices() {
    setPrices(prices.slice(0, -1));
  }

  function addReq() {
    setReqs(reqs.concat(<Requirement key={reqs.length} />));
  }

  function deleteReq() {
    setReqs(reqs.slice(0, -1));
  }

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]); // Store the selected image files
  };

  const fileInputRef = useRef(null);

  const handleClearFiles = () => {
    setSelectedFiles([]); // Clear the selected files from the state
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input field
    }
  };

  const [creating, setCreating] = useState(false);

  async function handleCreateCampaign(event) {
    event.preventDefault();

    setCreating(true);
    const formData = new FormData(event.target);
    const rawFormData = {
      title: formData.get("title"),
      date: formData.get("date"),
      slotsNumber: formData.get("slotsNumber"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      place: formData.get("place"),
      description: formData.get("description"),
      phone: formData.get("phone"),
      priceSpecial: formData.get("priceSpecial"),
      requirements: formData.getAll("requirement"),
    };

    if (rawFormData.startTime >= rawFormData.endTime) {
      toast.error("¡La hora de inicio debe ser antes que la última cita!");
      setCreating(false);
      return;
    }

    const prices = formData.getAll("price");
    const weights = formData.getAll("weight");
    rawFormData.pricesData = prices.map((price, index) => {
      return { price: price, weight: weights[index] };
    });

    try {
      const path = `campaigns/campaign-${Date.now()}`; // Add a timestamp
      const fileInput = document.getElementById("photos");
      const fileData = new FormData();
      fileData.append("path", path);

      // Append each file individually
      for (let i = 0; i < fileInput.files.length; i++) {
        fileData.append("files", fileInput.files[i]);
      }

      const response = await fetch("/api/campaigns/upload", {
        method: "POST",
        body: fileData,
      });
      const downloadURLs = await response.json();
      console.log(downloadURLs);
      rawFormData.photos = downloadURLs;
      toast.success("¡Fotos subidas con éxito!");
    } catch (error) {
      toast.error(error.message);
      setCreating(false);
      return;
    }

    try {
      const response = await CampaignController.createCampaign(rawFormData);
      console.log(response);
      if (response.ok) {
        toast.success("¡Campaña creada con éxito!", {
          position: "top-center",
          autoClose: 5000,
          toastId: "create-campaign",
          onClose: () => {
            setCreating(false);
            router.push("/admin");
          },
        });
      } else {
        console.log("ERROR 1");
        toast.error("¡Error al crear la campaña!", {
          position: "top-center",
          autoClose: 8000,
          toastId: "create-campaign",
        });
        setCreating(false);
      }
    } catch (error) {
      toast.error("¡Error al crear la campaña!", {
        position: "top-center",
        autoClose: 8000,
        toastId: "create-campaign",
      });
      setCreating(false);
    }
  }
  return (
    <Container onSubmit={handleCreateCampaign}>
      <Form>
        <div className="card shadow-sm p-5 mt-3">
          <h2 className="mb-3" style={{ color: "#606060" }}>
            Información general
          </h2>
          <Form.Group controlId="title">
            <Form.Label className="fw-semibold">Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el título de la campaña"
              name="title"
              required
              defaultValue={"Campaña de Castración para Perros y Gatos"}
            />
          </Form.Group>
          <Row className="mt-3">
            <Col>
              <Form.Group
                controlId="date"
                className="d-flex align-items-center"
              >
                <Form.Label className="fw-semibold me-2 mb-0">
                  Fecha:
                </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Seleccione la fecha de inicio"
                  defaultValue={tomorrow}
                  name="date"
                  required
                  style={{ flex: 1 }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group
                controlId="slotsNumber"
                className="d-flex align-items-center"
              >
                <Form.Label className="fw-semibold me-2 mb-0">
                  Citas por hora:
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Indique la cantidad de citas por hora"
                  defaultValue="10"
                  name="slotsNumber"
                  required
                  min="2"
                  max="50"
                  step="2"
                  style={{ flex: 1 }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Form.Group
                controlId="startTime"
                className="d-flex align-items-center"
              >
                <Form.Label className="fw-semibold me-2 mb-0">
                  Hora de inicio:
                </Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Seleccione la hora de inicio de la campaña"
                  defaultValue="07:30" // Correct 24-hour format
                  name="startTime"
                  required
                  style={{ flex: 1 }}
                  step="1800" // 30 minutes
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group
                controlId="endTime"
                className="d-flex align-items-center"
              >
                <Form.Label className="fw-semibold me-2 mb-0">
                  Hora de la última cita:
                </Form.Label>
                <Form.Control
                  type="time"
                  placeholder="Seleccione la hora de inicio de la campaña"
                  defaultValue="15:00" // Correct 24-hour format
                  name="endTime"
                  required
                  style={{ flex: 1 }}
                  step="3600"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Text>
            La hora de inicio debe ser a intervalos de 30 minutos. Solo puede
            seleccionar una hora en punto o a la mitad de la hora. Por ejemplo,
            puedes elegir 08:00 o 08:30, pero no valores como 08:15 o 08:45. La
            hora de la última cita solo puede estar en horas exactas, es decir,
            solo puedes seleccionar horas como 14:00, 15:00, etc. El número de
            citas por hora solo pueden ser números pares.
          </Form.Text>
          <Row className="mt-3">
            <Form.Group controlId="location">
              <Form.Label className="fw-semibold">Ubicación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la ubicación del evento"
                name="place"
                required
              />
            </Form.Group>
          </Row>
          <Row className="mt-3">
            <Form.Group controlId="description">
              <Form.Label className="fw-semibold">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Indique la descripción para la campaña"
                name="description"
                required
                defaultValue={
                  "Campaña de castración. Incluye medicación inyectada, medicación para la casa, desparasitación, corte de uñas, mini limpieza dental y limpieza de orejas."
                }
              />
            </Form.Group>
          </Row>
          <Row className="mt-3">
            <Form.Group controlId="contactNumber">
              <Form.Label className="fw-semibold">
                Número de Contacto
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el número de contacto"
                name="phone"
                required
              />
            </Form.Group>
          </Row>
        </div>
        <div className="card shadow-sm p-5 mt-3">
          <h2 className="mb-3" style={{ color: "#606060" }}>
            Precios
          </h2>
          <Row className="mt-3">
            <Form.Label className="fw-semibold">Precios:</Form.Label>
            <br />
            <Form.Text>
              Ingrese los rangos de precios. Para la última categoría, ingrese
              100kg.
            </Form.Text>
            {prices}
            <div className="container">
              {prices.length < 5 && (
                <button
                  className="active:opacity-55 btn"
                  onClick={() => addPrices()}
                  type="button"
                  aria-label="Agregar precio"
                >
                  <CirclePlus size="40px" />
                </button>
              )}
              {prices.length > 1 && (
                <button
                  className="active:opacity-55 btn"
                  onClick={() => deletePrices()}
                  type="button"
                  aria-label="Eliminar precio"
                >
                  <CircleMinus size="40px" />
                </button>
              )}
            </div>
          </Row>
          <Row className="mt-3">
            <Form.Group
              controlId={`priceSpecial`}
              as={Row}
              className="align-items-center"
            >
              <Form.Label column sm={2}>
                Precio para situaciones especiales:
              </Form.Label>
              <Col sm={4}>
                <Form.Control
                  name="priceSpecial"
                  placeholder="Precio para situaciones especiales"
                  defaultValue={5000}
                  required
                />
              </Col>
            </Form.Group>
          </Row>
        </div>
        <div className="card shadow-sm p-5 mt-3">
          <h2 className="mb-3" style={{ color: "#606060" }}>
            Requisitos
          </h2>
          <Row className="mt-3">
            <Form.Label className="fw-semibold">Requisitos:</Form.Label>
            {reqs}
            <div className="container">
              {reqs.length < 5 && (
                <button
                  className="active:opacity-55 btn"
                  onClick={() => addReq()}
                  type="button"
                  aria-label="Agregar precio"
                >
                  <CirclePlus size="40px" />
                </button>
              )}
              {reqs.length > 1 && (
                <button
                  className="active:opacity-55 btn"
                  onClick={() => deleteReq()}
                  type="button"
                  aria-label="Eliminar precio"
                >
                  <CircleMinus size="40px" />
                </button>
              )}
            </div>
          </Row>
        </div>
        <div className="card shadow-sm p-5 mt-3">
          <h2 className="mb-3" style={{ color: "#606060" }}>
            Imágenes
          </h2>
          <Row className="mt-3">
            <Form.Group controlId="photos" className="mb-3">
              <Form.Label className="fw-semibold">
                Suba las fotos para promocionar la campaña (Afiche, campañas
                pasadas, etc.)
              </Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                name="photos"
                ref={fileInputRef}
                required
              />
              <Form.Text className="text-muted">
                Puede subir varias fotos.
              </Form.Text>
            </Form.Group>
            {selectedFiles.length > 0 && (
              <div className="mt-3">
                <p>Imágenes seleccionadas:</p>
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
                <Button variant="danger" onClick={handleClearFiles}>
                  Eliminar fotos
                </Button>
              </div>
            )}
          </Row>
        </div>
        <Button
          variant="primary"
          type="submit"
          className="mt-3 mb-5"
          disabled={creating}
        >
          Crear campaña
        </Button>
      </Form>
    </Container>
  );
}

export default CreateForm;
