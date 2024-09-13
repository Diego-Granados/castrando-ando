"use client";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useRef } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";
import Price from "./Price";
import Requirement from "./Requirement";
import { storage } from "@/lib/firebase/config";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function CreateForm() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [prices, setPrices] = useState([
    <Price key={0} id={0} price={13000} weight={10} />,
    <Price key={1} id={1} price={16000} weight={15} />,
    <Price key={2} id={2} price={22000} weight={20} />,
    <Price key={3} id={3} price={26000} weight={100} />,
  ]);

  const [reqs, setReqs] = useState([
    <Requirement
      key={0}
      defaultRequirement={"Animales en perfecto estado de salud."}
    />,
    <Requirement
      key={1}
      defaultRequirement={
        "Solo animales con 12 horas de ayuno (comida y agua)."
      }
    />,
    <Requirement key={2} defaultRequirement={"Llevar cobija."} />,
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

  // Función para subir múltiples archivos a Firebase Storage
  async function uploadFiles(fileList, path) {
    // Array para almacenar las URLs de descarga de cada archivo
    const downloadURLs = [];

    // Iterar a través del array de archivos (fileList)
    for (const file of fileList) {
      const storageRef = ref(storage, `campaigns/${path}/${file.name}`); // Crear una referencia para cada archivo

      try {
        // Subir el archivo a Firebase Storage
        await uploadBytes(storageRef, file);

        // Obtener la URL de descarga
        const downloadURL = await getDownloadURL(storageRef);

        // Agregar la URL de descarga al array
        downloadURLs.push(downloadURL);
      } catch (error) {
        throw new Error(`Error al subir el archivo ${file.name}.`);
      }
    }

    return downloadURLs;
  }

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
      priceSpecial: formData.get("priceSpecial"),
      requirements: formData.getAll("requirement"),
    };

    console.log(rawFormData);

    const prices = formData.getAll("price");
    const weights = formData.getAll("weight");
    rawFormData.pricesData = prices.map((price, index) => {
      return { price: price, weight: weights[index] };
    });
    console.log(rawFormData.pricesData);

    try {
      const path = `campaign-${Date.now()}`; // Add a timestamp
      const fileInput = document.getElementById("photos");
      const downloadURLs = await uploadFiles(fileInput.files, path);
      rawFormData.photos = downloadURLs;
      toast.success("¡Fotos subidas con éxito!");
    } catch (error) {
      toast.error(error.message);
      setCreating(false);
      return;
    }

    try {
      console.log("fetching");
      const response = await fetch("/api/campaigns/create", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: rawFormData }),
      });

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
        toast.error("¡Error al crear la campaña!", {
          position: "top-center",
          autoClose: 8000,
          toastId: "create-campaign",
        });
        setCreating(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("¡Error al crear la campaña!", {
        position: "top-center",
        autoClose: 8000,
        toastId: "create-campaign",
      });
      setCreating(false);
    }
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
            defaultValue={"Campaña de Castración para Perros y Gatos"}
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
            defaultValue={
              "Campaña de castración. Incluye medicación inyectada, medicación para la casa, \
              desparasitación, corte de uñas, mini limpieza dental y limpieza de orejas."
            }
          />
        </Form.Group>
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
              type="number"
              placeholder="Precio para situaciones especiales"
              defaultValue={5000}
              required
            />
          </Col>
        </Form.Group>

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
            type="number"
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
