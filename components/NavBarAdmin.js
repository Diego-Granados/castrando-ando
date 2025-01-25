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
import NotificationsPopoverAdmin from "./NotificationsPopoverAdmin";

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
            <NavDropdown
              title="Campañas de castración"
              id="campaigns-nav-dropdown"
            >
              <Link href="/admin/crear" passHref legacyBehavior>
                <NavDropdown.Item>Crear campaña</NavDropdown.Item>
              </Link>
              <Link href="/admin" passHref legacyBehavior>
                <NavDropdown.Item>Administrar campañas</NavDropdown.Item>
              </Link>
              <Link href="/admin/medicines" passHref legacyBehavior>
                <NavDropdown.Item>Administrar medicamentos</NavDropdown.Item>
              </Link>
            </NavDropdown>

            <NavDropdown title="Comunidad" id="community-nav-dropdown">
              <Link href="/admin/actividades/crear" passHref legacyBehavior>
                <NavDropdown.Item>Crear actividad</NavDropdown.Item>
              </Link>
              <Link href="/admin/actividades" passHref legacyBehavior>
                <NavDropdown.Item>Administrar actividades</NavDropdown.Item>
              </Link>
              <Link href="/admin/blog" passHref legacyBehavior>
                <NavDropdown.Item>Blog</NavDropdown.Item>
              </Link>
              <Link href="/admin/usuarios" passHref legacyBehavior>
                <NavDropdown.Item>Actividad de usuarios</NavDropdown.Item>
              </Link>
              <Link href="/admin/volunteers" passHref legacyBehavior>
                <NavDropdown.Item>Voluntarios</NavDropdown.Item>
              </Link>
              <Link href="/admin/allies" passHref legacyBehavior>
                <NavDropdown.Item>Aliados</NavDropdown.Item>
              </Link>
              <Link href="/mensajes" passHref legacyBehavior>
                <NavDropdown.Item>Foro mensajes</NavDropdown.Item>
              </Link>
            </NavDropdown>

            <NavDropdown title="Contacto" id="contact-nav-dropdown">
              <Link href="/admin/ayuda" passHref legacyBehavior>
                <NavDropdown.Item>Ayuda</NavDropdown.Item>
              </Link>
              <Link href="/admin/contacto" passHref legacyBehavior>
                <NavDropdown.Item>Contacto</NavDropdown.Item>
              </Link>
              <Link href="/admin/newsletter" passHref legacyBehavior>
                <NavDropdown.Item>Boletín</NavDropdown.Item>
              </Link>
            </NavDropdown>

            <NavDropdown title="Apoyo a animales" id="support-nav-dropdown">
              <Link href="/admin/adopcion" passHref legacyBehavior>
                <NavDropdown.Item>Administrar adopciones</NavDropdown.Item>
              </Link>
              <Link href="/admin/perdidos" passHref legacyBehavior>
                <NavDropdown.Item>
                  Administrar mascotas perdidas
                </NavDropdown.Item>
              </Link>
              <Link href="/admin/solicitarApoyo" passHref legacyBehavior>
                <NavDropdown.Item>Solicitar apoyo</NavDropdown.Item>
              </Link>
            </NavDropdown>

            <NavDropdown
              title="Recaudación de fondos"
              id="fundraising-nav-dropdown"
            >
              <Link href="/admin/sales" passHref legacyBehavior>
                <NavDropdown.Item>Productos</NavDropdown.Item>
              </Link>
              <Link href="/admin/raffles" passHref legacyBehavior>
                <NavDropdown.Item>Rifas</NavDropdown.Item>
              </Link>
            </NavDropdown>
          </Nav>
          <NotificationsPopoverAdmin />
          <Form inline="true" onSubmit={handleSignout}>
            <Button type="submit">Cerrar sesión</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
