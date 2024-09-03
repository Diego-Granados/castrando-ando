"use client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function NavBarAdmin() {
  const router = useRouter();

  async function handleSignout(event) {
    event.preventDefault();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push("/");
      })
      .catch((error) => {
        // An error happened.
      });
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src="/logo.jpg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Asociación Animalitos Abandonados
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Crear</Nav.Link>
            <Nav.Link href="/">Campañas</Nav.Link>
            <Nav.Link href="/aboutus">Quiénes somos</Nav.Link>
            <Nav.Link href="/contacto">Contacto</Nav.Link>
          </Nav>
          <Form inline onSubmit={handleSignout}>
            <Button type="submit">Cerrar sesión</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
