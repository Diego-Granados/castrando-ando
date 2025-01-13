"use client";
import { Row, Col, Button, Form } from "react-bootstrap";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Carousel } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Badge from "react-bootstrap/Badge";
import useSubscription from "@/hooks/useSubscription";
import CampaignController from "@/controllers/CampaignController";
import CampaignCommentController from "@/controllers/CampaignCommentController";
import { auth } from "@/lib/firebase/config";

export default function Campaign() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const [campaign, setCampaign] = useState(null);
  const [active, setActive] = useState(true);
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef(null);

  if (!campaignId) {
    router.push("/");
  }

  function setCampaignState(campaign) {
    const datetime = new Date(campaign.date + "T" + "15:00:00");
    const today = new Date();
    setActive(today <= datetime);
    setCampaign(campaign);
  }

  const { loading, error } = useSubscription(() =>
    CampaignController.getCampaignById(campaignId, setCampaignState)
  );

  const dateFormat = new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (campaignId) {
      CampaignCommentController.getComments(campaignId, setComments);
      setIsAuthenticated(CampaignCommentController.isUserAuthenticated());
    }
  }, [campaignId]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const result = await CampaignCommentController.createComment(campaignId, newComment);
      if (result.ok) {
        setNewComment("");
        await CampaignCommentController.getComments(campaignId, setComments);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error enviando comentario:", error);
      alert("Error al enviar el comentario");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const result = await CampaignCommentController.deleteComment(campaignId, commentId);
      if (result.ok) {
        await CampaignCommentController.getComments(campaignId, setComments);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      alert("Error al eliminar el comentario");
    }
  };

  return (
    <main className="container">
      <h1>Asociación Castrando Ando</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div>Error: No hay una campaña con este identificador.</div>
      ) : campaign ? (
        <Row>
          <Col xs={12} md={4}>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h2 className="card-title text-center">{campaign.title}</h2>
                <Badge bg={active ? "success" : "danger"} className="mb-3">
                  {active ? "Activa" : "Terminada"}
                </Badge>
                <h3 className="card-title">Fecha</h3>
                <p className="card-text">
                  {dateFormat.format(new Date(`${campaign.date}T12:00:00Z`))}
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
                    {campaign.priceSpecial} (preñez, celo, piometra, perros XL,
                    entre otros)
                  </strong>
                </p>
                {active && (
                  <div className="d-flex justify-content-center">
                    <Link href={`campaign/citas?id=${campaignId}`}>
                      <Button
                        variant="primary"
                        aria-label={`Agendar cita para ${campaign.title} en ${campaign.place} el día ${campaign.date}`}
                      >
                        AGENDAR CITA
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col xs={12} md={4}>
            <div className="card shadow-sm mb-4">
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

          <Col xs={12} md={4}>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3 className="text-center mb-4">Preguntas sobre la campaña</h3>
                
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {comments.length === 0 ? (
                    <p className="text-center">No hay preguntas aún</p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`mb-3 p-3 border rounded ${
                          isAuthenticated && comment.authorId === auth.currentUser?.uid
                            ? "ms-auto"
                            : "me-auto"
                        }`}
                        style={{ maxWidth: "80%" }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <strong>{comment.author}</strong>
                          <small className="text-muted">{comment.createdAt}</small>
                        </div>
                        <p className="mb-1">{comment.content}</p>
                        {isAuthenticated && comment.authorId === auth.currentUser?.uid && (
                          <Button
                            variant="link"
                            className="p-0 text-danger"
                            onClick={() => handleDelete(comment.id)}
                          >
                            🗑️
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {isAuthenticated ? (
                  <Form onSubmit={handleSubmit} className="mt-3">
                    <Form.Group className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe tu pregunta..."
                      />
                      <Button type="submit" variant="primary">
                        Enviar
                      </Button>
                    </Form.Group>
                  </Form>
                ) : (
                  <p className="text-center mt-3">
                    Debes iniciar sesión para hacer preguntas
                  </p>
                )}
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <h2>No hay una campaña. Regrese el menú principal.</h2>
      )}
    </main>
  );
}
