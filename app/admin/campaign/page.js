"use client";
import { Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { ref, onValue } from "firebase/database";
import { Carousel } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { deleteCampaign } from "@/app/api/campaigns/delete/route";

export default function Campaign() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const [campaign, setCampaign] = useState(null);
  const [active, setActive] = useState(true);
  const router = useRouter();
  if (!campaignId) {
    router.push("/admin");
  }

  useEffect(() => {
    console.log("campaignId", campaignId);
    const campaignRef = ref(db, `campaigns/${campaignId}`);

    const unsubscribe = onValue(campaignRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No data available");
        return;
      }
      const value = snapshot.val();
      console.log(value);
      const datetime = new Date(value.date + "T" + "15:00:00");
      const today = new Date();
      setActive(today <= datetime);
      setCampaign(value);
    });

    return () => unsubscribe();
  }, [db]);

  const [showCancel, setShowCancel] = useState(false);
  const handleCloseCancel = () => setShowCancel(false);
  const handleShowCancel = () => setShowCancel(true);

  async function handleDeleteCampaign() {
    const response = await deleteCampaign({ campaignId });
    // const response = await fetch("/api/campaigns/delete", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     formData: { campaignId },
    //   }),
    // });
    if (response.ok) {
      toast.success("Campaña eliminada correctamente.");
      router.push("/admin");
    } else {
      toast.error("Error al eliminar la campaña.");
    }
    handleCloseCancel();
  }

  return (
    <main className="container">
      <h1>Asociación Animalitos Abandonados</h1>
      {campaign && (
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
                  <p className="card-text">{campaign.date}</p>
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
                        {price.weight != "100"
                          ? `hasta ${price.weight}`
                          : `más de ${campaign.pricesData[index - 1].weight}`}{" "}
                        kg
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>
                      Cargo adicional en casos especiales de ₡
                      {campaign.priceSpecial} (preñez, celo, piometra, entre
                      otros)
                    </strong>
                  </p>

                  <div className="d-flex justify-content-center gap-3">
                    <Link href={`/admin/campaign/inscritos?id=${campaignId}`}>
                      <Button
                        variant="info"
                        aria-label={`Ver la lista de inscritos en la campaña ${campaign.title} en ${campaign.place} el día ${campaign.date}`}
                      >
                        Ver inscritos
                      </Button>
                    </Link>
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
        </>
      )}
    </main>
  );
}
