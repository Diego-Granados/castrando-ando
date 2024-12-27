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
          </Nav>
          <Form inline="true" onSubmit={handleSignout}>
            <Button type="submit">Cerrar sesión</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
