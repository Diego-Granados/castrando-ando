"use client";
import { Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Carousel } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import useSubscription from "@/hooks/useSubscription";
import CampaignController from "@/controllers/CampaignController";

import Table from "react-bootstrap/Table";
import Comments from "@/components/Comments";

export default function Campaign() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const [campaign, setCampaign] = useState(null);
  const [active, setActive] = useState(true);
  const router = useRouter();
  if (!campaignId) {
    router.push("/admin");
  }

  function setCampaignState(campaign) {
    const datetime = new Date(campaign.date + "T" + "15:00:00");
    const today = new Date();
    setActive(today <= datetime);
    setCampaign(campaign);
    // Parse weight field as number where possible
    campaign.pricesData = campaign.pricesData.map((price) => ({
      ...price,
      weight: isNaN(price.weight) ? price.weight : parseInt(price.weight),
    }));
  }

  const { loading, error } = useSubscription(() =>
    CampaignController.getCampaignById(campaignId, setCampaignState)
  );

  const [showCancel, setShowCancel] = useState(false);
  const handleCloseCancel = () => setShowCancel(false);
  const handleShowCancel = () => setShowCancel(true);

  async function handleDeleteCampaign() {
    const response = await CampaignController.deleteCampaign({
      campaignId,
      photos: campaign.photos,
    });
    if (response.ok) {
      toast.success("Campaña eliminada correctamente.");
      router.push("/admin");
    } else {
      toast.error("Error al eliminar la campaña.");
    }
    handleCloseCancel();
  }

  const dateFormat = new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const [showInventory, setShowInventory] = useState(false);
  const [inventoryEstimate, setInventoryEstimate] = useState(null);
  const [calculatingInventory, setCalculatingInventory] = useState(false);

  const handleCalculateInventory = async () => {
    setCalculatingInventory(true);
    try {
      const totals = await CampaignController.calculateMedicineNeeds(
        campaignId
      );

      setInventoryEstimate(totals);
      setShowInventory(true);
    } catch (error) {
      console.error("Error calculating inventory:", error);
      toast.error("Error al calcular el inventario estimado");
    } finally {
      setCalculatingInventory(false);
    }
  };

  return (
    <main className="container">
      <h1>Asociación Castrando Ando</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div>Error: No hay una campaña con este identificador.</div>
      ) : (
        campaign && (
          <>
            <Row>
              <Col xs={12} sm={6}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h2 className="card-title text-center">{campaign.title}</h2>
                    <Badge bg={active ? "success" : "danger"} className="mb-3">
                      {active ? "Activa" : "Terminada"}
                    </Badge>
                    <h3 className="card-title">Fecha</h3>
                    <p className="card-text">
                      {dateFormat.format(
                        new Date(`${campaign.date}T12:00:00Z`)
                      )}
                    </p>
                    <h3 className="card-title">Lugar</h3>
                    <p className="card-text">{campaign.place}</p>
                    <h3 className="card-text">Requisitos</h3>
                    <ul>
                      {campaign.requirements.map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                    <h3 className="card-text">Precios</h3>
                    <ul>
                      {campaign.pricesData.map((price, index) => (
                        <li key={index}>
                          ₡{price.price}{" "}
                          {
                            typeof price.weight === "number"
                              ? price.weight !== 100
                                ? `Hasta ${price.weight} kg`
                                : `Más de ${
                                    campaign.pricesData[index - 1].weight
                                  } kg`
                              : price.weight // Display string category directly
                          }
                        </li>
                      ))}
                    </ul>
                    <p>
                      <strong>
                        Cargo adicional en casos especiales de ₡
                        {campaign.priceSpecial} (preñez, celo, piometra, perros
                        XL, entre otros)
                      </strong>
                    </p>

                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                      <Link href={`/admin/campaign/inscritos?id=${campaignId}`}>
                        <Button
                          variant="info"
                          aria-label={`Ver la lista de inscritos en la campaña ${campaign.title} en ${campaign.place} el día ${campaign.date}`}
                        >
                          Ver inscritos
                        </Button>
                      </Link>
                      <Button
                        variant="outline-primary"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${process.env.NEXT_PUBLIC_BASE_URL}campaign?id=${campaignId}`
                          );
                          toast.success("Link copiado al portapapeles");
                        }}
                      >
                        Copiar enlace de la campaña
                      </Button>
                      {active && (
                        <Link href={`/admin/campaign/editar?id=${campaignId}`}>
                          <Button
                            variant="primary"
                            aria-label={`Agendar cita para ${campaign.title} en ${campaign.place} el día ${campaign.date}`}
                          >
                            Editar campaña
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="danger"
                        aria-label={`Eliminar la campaña ${campaign.title} en ${campaign.place} el día ${campaign.date}`}
                        onClick={handleShowCancel}
                      >
                        Eliminar campaña
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleCalculateInventory}
                        disabled={calculatingInventory}
                      >
                        {calculatingInventory
                          ? "Calculando..."
                          : "Calcular estimación de inventario"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="card shadow-sm">
                  <Carousel>
                    {campaign.photos.map((photo) => (
                      <Carousel.Item key={photo}>
                        <img
                          className="img-fluid d-block w-100"
                          style={{
                            objectFit: "contain",
                            height: "50vh",
                            width: "auto",
                          }}
                          src={photo}
                          alt=""
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <Row className="card-body">
                    <Col>
                      <h5 className="card-title">Disponibilidad</h5>
                      <p className="card-text">
                        Citas disponibles: {campaign.available}
                      </p>
                    </Col>
                    <Col>
                      <h5 className="card-title">Contacto</h5>
                      <p className="card-text">{campaign.phone}</p>
                    </Col>
                  </Row>
                  <p className="card-body">{campaign.description}</p>
                </div>
              </Col>
            </Row>

            <Row className="mt-4">
              <Col xs={12}>
                <Comments
                  entityType="campaign"
                  entityId={campaignId}
                  isAdmin={true}
                />
              </Col>
            </Row>

            <Modal show={showCancel} onHide={handleCloseCancel} centered>
              <Modal.Header closeButton>
                <Modal.Title>Eliminar campaña</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                ¿Está seguro que desea eliminar la campaña {campaign.title} en{" "}
                {campaign.place} el día {campaign.date}? Esta acción no se puede
                deshacer.
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
                  onClick={handleDeleteCampaign}
                  className="px-5"
                >
                  Sí
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal
              show={showInventory}
              onHide={() => setShowInventory(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Estimación de Inventario Necesario</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {inventoryEstimate ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Medicamento</th>
                        <th>Cantidad Total</th>
                        <th>Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryEstimate.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.total}</td>
                          <td>{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No hay datos disponibles</p>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowInventory(false)}
                >
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )
      )}
    </main>
  );
}
