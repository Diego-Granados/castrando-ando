"use client";
import { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal,
  Nav,
} from "react-bootstrap";
import { Plus, Pencil, Trash2, MoveUp, MoveDown } from "lucide-react";
import { toast } from "react-toastify";
import HelpController from "@/controllers/HelpController";

export default function AdminAyuda() {
  const [sections, setSections] = useState([]);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showPageModal, setShowPageModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionContent, setSectionContent] = useState("");
  const [sectionType, setSectionType] = useState("Texto");
  const [sectionUrl, setSectionUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [newPageName, setNewPageName] = useState("");
  const fileInputRef = useRef(null);
  const [showDeletePageModal, setShowDeletePageModal] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (activePage) {
      loadSections();
    }
  }, [activePage]);

  const loadPages = async () => {
    try {
      const helpPages = await HelpController.getPages();
      console.log("helpPages", helpPages);
      setPages(helpPages);
      if (helpPages.length > 0) {
        setActivePage(helpPages[0]);
      }
    } catch (error) {
      toast.error("Error al cargar las páginas de ayuda");
    }
  };

  const loadSections = async () => {
    try {
      const helpData = await HelpController.getHelpContent(activePage);
      setSections(helpData.sections || []);
    } catch (error) {
      toast.error("Error al cargar el contenido de ayuda");
    }
  };

  const handleAddPage = async () => {
    try {
      if (!newPageName.trim()) {
        toast.error("El nombre de la página no puede estar vacío");
        return;
      }

      const pageName = newPageName.trim();
      await HelpController.updateHelpContent(pageName, { sections: [] });
      setShowPageModal(false);
      setNewPageName("");
      await loadPages();
      setActivePage(pageName);
      toast.success("Página creada con éxito");
    } catch (error) {
      console.error("Error al crear la página", error);
      toast.error("Error al crear la página");
    }
  };

  const handleDeletePage = async () => {
    try {
      await HelpController.deletePage(activePage);
      await loadPages();
      setShowDeletePageModal(false);
      toast.success("Página eliminada con éxito");
    } catch (error) {
      toast.error("Error al eliminar la página");
    }
  };

  const handleAddSection = () => {
    setEditingSection(null);
    setSectionTitle("");
    setSectionContent("");
    setSectionType("Texto");
    setSectionUrl("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setShowSectionModal(true);
  };

  const handleEditSection = (section, index) => {
    setEditingSection(index);
    setSectionTitle(section.title);
    setSectionContent(section.content);
    setSectionType(section.type);
    setSectionUrl(section.url || "");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setShowSectionModal(true);
  };

  const handleDeleteSection = async (index) => {
    if (confirm("¿Está seguro que desea eliminar esta sección?")) {
      const newSections = [...sections];
      const deletedSection = newSections[index];

      if (deletedSection.type === "Imagen" && deletedSection.url) {
        try {
          await fetch("/api/storage/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ urls: [deletedSection.url] }),
          });
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }

      newSections.splice(index, 1);
      try {
        await HelpController.updateHelpContent(activePage, {
          sections: newSections,
        });
        setSections(newSections);
        toast.success("Sección eliminada con éxito");
      } catch (error) {
        toast.error("Error al eliminar la sección");
      }
    }
  };

  const handleMoveSection = async (index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + direction];
    newSections[index + direction] = temp;

    try {
      await HelpController.updateHelpContent(activePage, {
        sections: newSections,
      });
      setSections(newSections);
    } catch (error) {
      toast.error("Error al mover la sección");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor seleccione un archivo de imagen válido");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSaveSection = async () => {
    try {
      let imageUrl = sectionUrl;

      // If it's an image section and there's a new file selected
      if (sectionType === "Imagen" && selectedFile) {
        // If editing and there's an existing image, delete it
        if (editingSection !== null && sections[editingSection].url) {
          await fetch("/api/storage/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ urls: [sections[editingSection].url] }),
          });
        }

        // Upload new image
        const formData = new FormData();
        formData.append("files", selectedFile);
        formData.append("path", `help/${activePage}`);

        const uploadResponse = await fetch("/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error uploading image");
        }

        const urls = await uploadResponse.json();
        imageUrl = urls[0];
      }

      const newSection = {
        title: sectionTitle,
        content: sectionContent,
        type: sectionType,
        url: imageUrl,
      };

      const newSections = [...sections];
      if (editingSection !== null) {
        newSections[editingSection] = newSection;
      } else {
        newSections.push(newSection);
      }

      await HelpController.updateHelpContent(activePage, {
        sections: newSections,
      });
      setSections(newSections);
      setShowSectionModal(false);
      toast.success(
        editingSection !== null
          ? "Sección actualizada con éxito"
          : "Sección agregada con éxito"
      );
    } catch (error) {
      toast.error("Error al guardar la sección");
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Administrar Página de Ayuda</h2>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={() => setShowPageModal(true)}>
                <Plus size={20} className="me-2" />
                Nueva Página
              </Button>
              {activePage && (
                <Button
                  variant="danger"
                  onClick={() => setShowDeletePageModal(true)}
                >
                  <Trash2 size={20} className="me-2" />
                  Eliminar Página
                </Button>
              )}
            </div>
          </div>

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

              {activePage && (
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <h3>{activePage}</h3>
                  <Button variant="primary" onClick={handleAddSection}>
                    <Plus size={20} className="me-2" />
                    Agregar Sección
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {activePage &&
            sections.map((section, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h4>{section.title}</h4>
                      <p className="text-muted small">Tipo: {section.type}</p>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleMoveSection(index, -1)}
                        disabled={index === 0}
                      >
                        <MoveUp size={16} />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleMoveSection(index, 1)}
                        disabled={index === sections.length - 1}
                      >
                        <MoveDown size={16} />
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditSection(section, index)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteSection(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  {section.type === "Texto" && (
                    <div className="mt-3">
                      <p>{section.content}</p>
                    </div>
                  )}
                  {section.type === "Imagen" && (
                    <div className="mt-3">
                      <img
                        src={section.url}
                        alt={section.title}
                        className="img-fluid"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}
                  {section.type === "Video" && (
                    <div className="mt-3">
                      <div className="ratio ratio-16x9">
                        <iframe
                          width="560"
                          height="315"
                          src={section.url}
                          title="YouTube video player"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
        </Card.Body>
      </Card>

      {/* Section Modal */}
      <Modal
        show={showSectionModal}
        onHide={() => setShowSectionModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingSection !== null ? "Editar Sección" : "Agregar Sección"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Ingrese el título de la sección"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de contenido</Form.Label>
              <Form.Select
                value={sectionType}
                onChange={(e) => setSectionType(e.target.value)}
              >
                <option value="Texto">Texto</option>
                <option value="Imagen">Imagen</option>
                <option value="Video">Video</option>
              </Form.Select>
            </Form.Group>

            {sectionType === "Texto" && (
              <Form.Group className="mb-3">
                <Form.Label>Contenido</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={sectionContent}
                  onChange={(e) => setSectionContent(e.target.value)}
                  placeholder="Ingrese el contenido de la sección"
                />
              </Form.Group>
            )}

            {sectionType === "Imagen" && (
              <Form.Group className="mb-3">
                <Form.Label>Imagen</Form.Label>
                <div className="d-flex gap-2 align-items-center">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  {(selectedFile || sectionUrl) && (
                    <img
                      src={
                        selectedFile
                          ? URL.createObjectURL(selectedFile)
                          : sectionUrl
                      }
                      alt="Preview"
                      style={{ height: "50px" }}
                    />
                  )}
                </div>
              </Form.Group>
            )}

            {sectionType === "Video" && (
              <Form.Group className="mb-3">
                <Form.Label>URL del video (YouTube)</Form.Label>
                <Form.Control
                  type="url"
                  value={sectionUrl}
                  onChange={(e) => setSectionUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSectionModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveSection}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* New Page Modal */}
      <Modal show={showPageModal} onHide={() => setShowPageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Página de Ayuda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nombre de la página</Form.Label>
              <Form.Control
                type="text"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="Ej: Campañas, Citas, etc."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPageModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddPage}>
            Crear
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Page Modal */}
      <Modal
        show={showDeletePageModal}
        onHide={() => setShowDeletePageModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Página de Ayuda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar la página "{activePage}"?</p>
          <p className="text-danger">Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeletePageModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeletePage}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
