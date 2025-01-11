"use client";
import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import HelpController from "@/controllers/HelpController";

export default function Ayuda() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHelpContent();
  }, []);

  const loadHelpContent = async () => {
    try {
      const helpData = await HelpController.getHelpContent();
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
