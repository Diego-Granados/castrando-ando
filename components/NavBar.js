"use client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AuthController from "@/controllers/AuthController";
import Link from "next/link";
import useSubscription from "@/hooks/useSubscription";
import NotificationsPopover from "./NotificationsPopover";

function NavBar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUser, setIsUser] = useState(false);

  async function handleAuthStateChange(user) {
    if (user) {
      const role = await AuthController.getCurrentRole(user);
      setIsAuthenticated(true);
      setIsUser(role === "User");
    } else {
      setIsAuthenticated(false);
      setIsUser(false);
    }
  }

  const { loading, error } = useSubscription(() =>
    AuthController.subscribeToAuthState(handleAuthStateChange)
  );

  async function handleSignout(event) {
    event.preventDefault();
    await AuthController.signout();
    setIsAuthenticated(false);
    setIsUser(false);
    router.push("/");
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Link href="/" passHref legacyBehavior>
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
            <Link href="/" passHref legacyBehavior>
              <Nav.Link>Campañas</Nav.Link>
            </Link>
            <Link href="/appointments" passHref legacyBehavior>
              <Nav.Link>Citas</Nav.Link>
            </Link>
            <Link href="/aboutus" passHref legacyBehavior>
              <Nav.Link>Quiénes somos</Nav.Link>
            </Link>
            <Link href="/contacto" passHref legacyBehavior>
              <Nav.Link>Contacto</Nav.Link>
            </Link>
            <Link href="/ayuda" passHref legacyBehavior>
              <Nav.Link>Ayuda</Nav.Link>
            </Link>
            <Link href="/blog" passHref legacyBehavior>
              <Nav.Link>Blog</Nav.Link>
            </Link>
            <Link href="/mensajes" passHref legacyBehavior>
              <Nav.Link>Foro mensajes</Nav.Link>
            </Link>
            <Link href="/animales_perdidos" passHref legacyBehavior>
              <Nav.Link>Animales perdidos</Nav.Link>
            </Link>
            <Link href="/adopcion" passHref legacyBehavior>
              <Nav.Link>Adopción</Nav.Link>
            </Link>
            <Link href="/actividades" passHref legacyBehavior>
              <Nav.Link>Actividades</Nav.Link>
            </Link>
            <Link href="/solicitar-apoyo" passHref legacyBehavior>
              <Nav.Link>Solicitar apoyo</Nav.Link>
            </Link>
            <Link href="/calendario" passHref legacyBehavior>
              <Nav.Link>Calendario</Nav.Link>
            </Link>
          </Nav>
          <Nav>
            {isAuthenticated && isUser && <NotificationsPopover userType="user" />}
            {isAuthenticated && isUser ? (
              <>
                <Link href="/cuenta" passHref legacyBehavior>
                  <Nav.Link>Mi Cuenta</Nav.Link>
                </Link>
                <Form className="d-flex" onSubmit={handleSignout}>
                  <Button type="submit" variant="outline-primary">
                    Cerrar sesión
                  </Button>
                </Form>
              </>
            ) : (
              <Link href="/userLogin" passHref legacyBehavior>
                <Nav.Link>Iniciar sesión</Nav.Link>
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
