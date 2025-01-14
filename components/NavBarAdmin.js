"use client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useRouter } from "next/navigation";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AuthController from "@/controllers/AuthController";
import Link from "next/link";
import NotificationsPopover from "./NotificationsPopover";

export default function NavBarAdmin() {
  const router = useRouter();

  async function handleSignout(event) {
    event.preventDefault();
    await AuthController.signout();
    router.push("/");
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Link href="/admin" passHref legacyBehavior>
          <Navbar.Brand>
            <img
              alt=""
              src="/logo.jpg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Castrando Ando
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/admin/crear" passHref legacyBehavior>
              <Nav.Link>Crear campaña</Nav.Link>
            </Link>
            <Link href="/admin" passHref legacyBehavior>
              <Nav.Link>Administrar campañas</Nav.Link>
            </Link>
            <Link href="/admin/adopciones" passHref legacyBehavior>
              <Nav.Link>Administrar adopciones</Nav.Link>
            </Link>
            <Link href="/admin/perdidos" passHref legacyBehavior>
              <Nav.Link>Administrar mascotas perdidas</Nav.Link>
            </Link>
            <NavDropdown title="Actividades" id="basic-nav-dropdown">
              <Link href="/admin/actividades/crear" passHref legacyBehavior>
                <NavDropdown.Item>Crear actividad</NavDropdown.Item>
              </Link>
              <Link href="/admin/actividades" passHref legacyBehavior>
                <NavDropdown.Item>Administrar actividades</NavDropdown.Item>
              </Link>
            </NavDropdown>
            <Link href="/admin/usuarios" passHref legacyBehavior>
              <Nav.Link>Actividad de usuarios</Nav.Link>
            </Link>
            <Link href="/admin/ayuda" passHref legacyBehavior>
              <Nav.Link>Ayuda</Nav.Link>
            </Link>
            <Link href="/admin/contacto" passHref legacyBehavior>
              <Nav.Link>Contacto</Nav.Link>
            </Link>
            <Link href="/admin/newsletter" passHref legacyBehavior>
              <Nav.Link>Boletín</Nav.Link>
            </Link>
            <Link href="/admin/solicitudes" passHref legacyBehavior>
              <Nav.Link>Solicitudes</Nav.Link>
            </Link>
          </Nav>
          <NotificationsPopover userType="admin" />
          <Form inline="true" onSubmit={handleSignout}>
            <Button type="submit">Cerrar sesión</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
