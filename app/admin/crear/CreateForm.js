"use client";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useRef } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";
import Price from "./Price";
import Requirement from "./Requirement";
import { db } from "@/lib/firebase/config";
import { ref, push, set } from "firebase/database";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

function CreateForm() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [prices, setPrices] = useState([
    <Price key={0} id={0} price={13000} weight={10} />,
    <Price key={1} id={1} price={16000} weight={15} />,
    <Price key={2} id={2} price={22000} weight={20} />,
    <Price key={3} id={3} price={26000} weight={100} />,
  ]);

  const [reqs, setReqs] = useState([<Requirement key={0} />]);

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

  async function createCampaign(event) {
    event.preventDefault();
    setCreating(true);
    const formData = new FormData(event.target);
    const rawFormData = {
      title: formData.get("title"),
      date: formData.get("date"),
      place: formData.get("place"),
      description: formData.get("description"),
      phone: formData.get("phone"),
      photos: formData.get("photos"),
      prices: formData.getAll("price"),
      weights: formData.getAll("weight"),
      requirements: formData.getAll("requirement"),
    };

    console.log(rawFormData);

    const pricesData = rawFormData.prices.map((price, index) => {
      console.log({ price: price, weight: rawFormData.weights[index] });
      return { price: price, weight: rawFormData.weights[index] };
    });
    console.log(pricesData);

    const campaignRef = ref(db, "campaigns");
    // const newCampaignRef = push(campaignRef);
    // set(newCampaignRef, rawFormData)
    //   .then(() => {
    //     toast.success("¡Campaña creada con éxito!", {
    //       position: "top-center",
    //       autoClose: 5000,
    //       toastId: "create-campaign",
    //       onClose: () => router.push("/admin"),
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Error adding document: ", error);
    //     toast.error("¡Error al crear la campaña!", {
    //       position: "top-center",
    //       autoClose: 8000,
    //       toastId: "create-campaign",
    //     });
    //   });
    setCreating(false);
  }
  return (
    <Container onSubmit={createCampaign}>
      <Form>
        <Form.Group controlId="title">
          <Form.Label className="fw-semibold">Título</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el título de la campaña"
            name="title"
            required
          />
        </Form.Group>
        <Row className="mt-3">
          <Col>
            <Form.Group as={Row} controlId="startDate">
              <Form.Label className="fw-semibold" column sm={1}>
                Fecha:
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  type="date"
                  placeholder="Seleccione la fecha de inicio"
                  defaultValue={today}
                  name="date"
                  required
                />
              </Col>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="location">
          <Form.Label className="fw-semibold">Ubicación</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la ubicación del evento"
            name="place"
            required
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label className="fw-semibold">Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Indique los requisitos para la campaña"
            name="description"
            required
          />
        </Form.Group>
        <Form.Label className="fw-semibold">Precios:</Form.Label>
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
        <Form.Group controlId="contactNumber">
          <Form.Label className="fw-semibold">Número de Contacto</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Ingrese el número de contacto"
            name="phone"
            required
          />
        </Form.Group>

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

        <Button
          variant="primary"
          type="submit"
          className="mt-3 mb-5"
          disabled={creating}
        >
          Enviar
        </Button>
      </Form>
    </Container>
  );
}

export default CreateForm;
