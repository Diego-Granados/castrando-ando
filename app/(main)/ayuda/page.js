"use client";
import { useState, useEffect } from "react";
import { Container, Spinner, Nav, Card } from "react-bootstrap";
import HelpController from "@/controllers/HelpController";

export default function Ayuda() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (activePage) {
      loadHelpContent(activePage);
    }
  }, [activePage]);

  const loadPages = async () => {
    try {
      const helpPages = await HelpController.getPages();
      setPages(helpPages);
      if (helpPages.length > 0) {
        setActivePage(helpPages[0]);
      }
    } catch (error) {
      console.error("Error loading help pages:", error);
    }
  };

  const loadHelpContent = async (page) => {
    setLoading(true);
    try {
      const helpData = await HelpController.getHelpContent(page);
      setSections(helpData.sections || []);
    } catch (error) {
      console.error("Error loading help content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <main className="container mx-auto">
      <h1 className="text-center" style={{ color: "#2055A5" }}>
        Ayuda
      </h1>

      <Card className="mb-4">
        <Card.Body>
          <Nav variant="tabs" className="mb-3">
            {pages.map((page) => (
              <Nav.Item key={page}>
                <Nav.Link
                  active={activePage === page}
                  onClick={() => setActivePage(page)}
                >
                  {page}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Card.Body>
      </Card>

      {sections.map((section, index) => (
        <div key={index} className="row mt-5">
          {section.title && (
            <div>
              <h2 className="text-center">{section.title}</h2>
              <hr style={{ borderTop: "2px solid #ccc", margin: "20px 0" }} />
            </div>
          )}

          {section.type === "Texto" && (
            <div className="row" style={{ width: "auto" }}>
              <article>
                <p>
                  <font size="5">{section.content}</font>
                </p>
              </article>
            </div>
          )}

          {section.type === "Imagen" && (
            <div className="d-flex justify-content-center w-100">
              <img
                className="img-fluid row"
                style={{ maxHeight: "50vh", width: "auto" }}
                src={section.url}
                alt={section.title}
              />
            </div>
          )}

          {section.type === "Video" && (
            <div className="d-flex justify-content-center w-100">
              <div className="ratio ratio-16x9" style={{ maxWidth: "800px" }}>
                <iframe
                  width="560"
                  height="315"
                  src={section.url}
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
