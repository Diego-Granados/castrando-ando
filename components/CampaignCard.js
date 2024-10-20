import { Button } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import Link from "next/link";
import Badge from "react-bootstrap/Badge";
import { Col } from "react-bootstrap";

export default function CampaignCard({ campaign, admin }) {
  const datetime = new Date(campaign.date + "T" + "15:00:00");
  const today = new Date();
  const active = today <= datetime;
  return (
    <article
      className="container row px-3 my-1 w-75 mh-50"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}
    >
      <Col xs={12} md={6}>
        <Carousel>
          {campaign.photos.map((photo) => (
            <Carousel.Item key={photo}>
              <img
                className="d-block w-100"
                style={{ objectFit: "contain", height: "55vh", width: "auto" }}
                src={photo}
                alt=""
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Col>

      <Col className="my-3" xs={12} md={6}>
        <div className="campaign-info">
          <h2>{campaign.title}</h2>
          <Badge bg={active ? "success" : "danger"} className="mb-3">
            {active ? "Activa" : "Terminada"}
          </Badge>
          <div className="">
            <p>
              <strong>Fecha: {campaign.date}</strong>{" "}
            </p>
            <p>
              <strong>Lugar: {campaign.place}</strong>{" "}
            </p>
            <p>
              <strong>Cupos: {campaign.available}</strong>
            </p>
          </div>
          <Link
            href={(admin ? "/admin" : "") + `/campaign?id=${campaign.campaign}`}
          >
            <Button
              variant="primary"
              type="submit"
              aria-label={`Ver información de ${campaign.title} en ${campaign.place} el día ${campaign.date}`}
            >
              {admin ? "Editar" : "Agendar cita"}
            </Button>
          </Link>
        </div>
      </Col>
    </article>
  );
}
