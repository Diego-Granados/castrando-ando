import { Button } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import Link from "next/link";
export default function CampaignCard({ campaign }) {
  return (
    <article
      className="container row col-lg-6 px-5 my-5"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}
    >
      <Carousel>
        {campaign.photos.map((photo) => (
          <Carousel.Item key={photo}>
            <img className="d-block w-100" src={photo} alt="" />
          </Carousel.Item>
        ))}
      </Carousel>
      <div className="col my-5">
        <div className="campaign-info">
          <h2>{campaign.title}</h2>
          <div className="">
            <p>
              <strong>Fecha: {campaign.date}</strong>{" "}
            </p>
            <p>
              <strong>Lugar: {campaign.place}</strong>{" "}
            </p>
            <p>
              <strong>Cupos: {0}</strong>
            </p>
          </div>
          <Link href={`/campaign?id=${campaign.campaign}`}>
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
