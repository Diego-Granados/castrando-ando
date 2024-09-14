import { Button } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import Link from "next/link";
import Badge from "react-bootstrap/Badge";

export default function CampaignCard({ campaign, admin }) {
  const datetime = new Date(campaign.date + "T" + "15:00:00");
  const today = new Date();
  const active = today <= datetime;

  return (
    <article
      className="container row col-lg-6 px-3 my-3"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}
    >
      <Carousel className="col my-5">
        {campaign.photos.map((photo) => (
          <Carousel.Item key={photo}>
            <img
              className="d-block w-100"
              style={{ objectFit: "cover", height: "50vh", width: "auto" }}
              src={photo}
              alt=""
            />
          </Carousel.Item>
        ))}
      </Carousel>
      <div className="col my-5">
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
              Ver más
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
