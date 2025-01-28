"use client";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState, useRef } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";
import Price from "@/components/Price";
import Requirement from "@/components/Requirement";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CampaignController from "@/controllers/CampaignController";

function EditForm({ campaign, campaignId }) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [prices, setPrices] = useState(
    campaign.pricesData.map((price, index) => (
      <Price key={index} id={index} price={price.price} weight={price.weight} />
    ))
  );

  const [reqs, setReqs] = useState(
    campaign.requirements.map((requirement, index) => (
      <Requirement key={index} defaultRequirement={requirement} />
    ))
  );

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

  const [updating, setUpdating] = useState(false);

  // Función para subir múltiples archivos a Firebase Storage
  async function uploadFiles(fileList, path) {
    // Array para almacenar las URLs de descarga de cada archivo
    let downloadURLs = [];

    if (fileList.length > 0) {
      const fileData = new FormData();
      fileData.append("path", path);
      for (let i = 0; i < fileList.length; i++) {
        fileData.append("files", fileList[i]);
      }

      const uploadResponse = await fetch("/api/storage/upload", {
        method: "POST",
        body: fileData,
      });
      downloadURLs = await uploadResponse.json();

      const deleteResponse = await fetch("/api/storage/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ urls: campaign.photos }),
      });

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete old files");
      }
      console.log("images deleted");
    }
    return downloadURLs;
  }

  async function handleUpdateCampaign(event) {
    event.preventDefault();

    setUpdating(true);
    const formData = new FormData(event.target);
    const rawFormData = {
      title: formData.get("title"),
      date: formData.get("date"),
      place: formData.get("place"),
      description: formData.get("description"),
      phone: formData.get("phone"),
      priceSpecial: formData.get("priceSpecial"),
      requirements: formData.getAll("requirement"),
      campaignId,
    };

    const prices = formData.getAll("price");
    const weights = formData.getAll("weight");

    // Validate weights are in ascending order and handle special cases
    let lastNumericWeight = -1;
    let foundString = false;
    let found100 = false;
    let foundNumber = false;
    let typeLock = "";
    console.log(weights);
    for (let i = 0; i < weights.length; i++) {
      const weight = weights[i];
      const isNumeric = !isNaN(weight);
      console.log(weight, isNumeric);
      console.log(typeLock);
      if (typeLock === "number" && !isNumeric) {
        toast.error("No se permite intercalar números y frases");
        setUpdating(false);
        return;
      } else if (typeLock === "string" && isNumeric) {
        toast.error("No se permite intercalar números y frases");
        setUpdating(false);
        return;
      }

      // Validate weight and price are greater than 0
      if (isNumeric && parseInt(weight) <= 0) {
        toast.error("Los pesos deben ser mayores a 0");
        setUpdating(false);
        return;
      }
      if (parseInt(prices[i]) <= 0) {
        toast.error("Los precios deben ser mayores a 0");
        setUpdating(false);
        return;
      }

      if (isNumeric) {
        if (found100) {
          toast.error("No se permiten más pesos numéricos después de 100");
          setUpdating(false);
          return;
        }
        const numWeight = parseInt(weight);

        // Check if weight is 100
        if (numWeight === 100) {
          if (i === 0) {
            toast.error("El peso 100 no puede ser el primer elemento");
            setUpdating(false);
            return;
          }
          if (isNaN(weights[i - 1])) {
            toast.error("El peso anterior al 100 debe ser un número");
            setUpdating(false);
            return;
          }
          if (!isNaN(weights[i - 1]) && parseInt(weights[i - 1]) >= 100) {
            toast.error("El peso anterior al 100 debe ser menor que 100");
            setUpdating(false);
            return;
          }
          found100 = true;
          if (!foundString) {
            typeLock = "string";
          }
          continue;
        }

        // Check ascending order within each numeric section
        if (numWeight <= lastNumericWeight) {
          toast.error("Los pesos deben estar en orden ascendente");
          setUpdating(false);
          return;
        }

        if (foundString) {
          typeLock = "number";
        }
        lastNumericWeight = numWeight;
        foundNumber = true;
      } else {
        if (foundNumber) {
          typeLock = "string";
        }
        foundString = true;
      }
    }

    rawFormData.pricesData = prices.map((price, index) => {
      const weight = weights[index];
      return {
        price: parseInt(price),
        weight: isNaN(weight) ? weight : parseInt(weight), // Keep as string if not a number
      };
    });
    console.log(rawFormData.pricesData);

    try {
      const path = `campaigns/campaign-${Date.now()}`; // Add a timestamp
      const fileInput = document.getElementById("photos");
      const downloadURLs = await uploadFiles(fileInput.files, path);
      rawFormData.photos = downloadURLs;
      if (downloadURLs.length != 0) {
        toast.success("¡Fotos subidas con éxito!");
      }
    } catch (error) {
      toast.error(error.message);
      setUpdating(false);
      return;
    }

    try {
      const response = await CampaignController.updateCampaign(rawFormData);
      if (response.ok) {
        toast.success("¡Campaña actualizada con éxito!", {
          position: "top-center",
          autoClose: 5000,
          toastId: "update-campaign",
          onClose: () => {
            setUpdating(false);
          },
        });
      } else {
        toast.error("¡Error al actualizar la campaña!", {
          position: "top-center",
          autoClose: 8000,
          toastId: "update-campaign",
        });
        setUpdating(false);
      }
    } catch (error) {
      toast.error("¡Error al actualizar la campaña!", {
        position: "top-center",
        autoClose: 8000,
        toastId: "update-campaign",
      });
      setUpdating(false);
    }
  }
  return (
    <Container onSubmit={handleUpdateCampaign}>
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
              defaultValue={campaign.title}
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
                    defaultValue={campaign.date}
                    name="date"
                    required
                  />
                </Col>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Form.Group controlId="location">
              <Form.Label className="fw-semibold">Ubicación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la ubicación del evento"
                name="place"
                required
                defaultValue={campaign.place}
              />
            </Form.Group>
          </Row>

          <Row className="mt-3">
            <Form.Group controlId="description">
              <Form.Label className="fw-semibold">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Indique los requisitos para la campaña"
                name="description"
                required
                defaultValue={campaign.description}
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
                defaultValue={campaign.phone}
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
                  defaultValue={campaign.priceSpecial}
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
        </div>

        <Button
          variant="primary"
          type="submit"
          className="mt-5 mb-5"
          disabled={updating}
        >
          Guardiar cambios
        </Button>
        <Link href={`/admin/campaign?id=${campaignId}`} className="mb-5 mx-5">
          <Button variant="dark">Regresar</Button>
        </Link>
      </Form>
    </Container>
  );
}

export default EditForm;
