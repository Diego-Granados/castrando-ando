import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import NavBarAdmin from "@/components/NavBarAdmin";
import { ToastContainer } from "react-toastify";
export const metadata = {
  title: "Asociación Castrando Ando",
  description: "Sitio de la Asociación Castrando Ando",
};
import RouteGuard from "@/components/RouteGuard";
import Link from "next/link";
import "./globals.css";
import { Mail, Phone } from "lucide-react";
import { Suspense } from "react";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <NavBarAdmin />
        </header>{" "}
        <ToastContainer />
        <RouteGuard requiredRole="Admin">
          <Suspense fallback={<h2>Cargando...</h2>}>{children}</Suspense>
        </RouteGuard>
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top px-5">
          <div className="col-md-4 d-flex align-items-center">
            <Link
              href="/"
              className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
            >
              <img
                alt=""
                src="/logo.jpg"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
            </Link>
            <span className="mb-3 mb-md-0 text-body-secondary">
              © 2025 Asociación Castrando Ando
            </span>
          </div>
          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="mx-1">
              <Phone />
            </li>
            <li>
              <span className="mb-3 mb-md-0 text-body-secondary">
                8585-8505
              </span>
            </li>
            <li className="ms-3">
              <a
                className="text-body-secondary"
                href="mailto:castracionescr@gmail.com"
              >
                <Mail />
              </a>
            </li>

            <li className="ms-3">
              <a
                className="text-body-secondary"
                href="https://www.facebook.com/profile.php?id=100067041306155"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="currentColor"
                  className="bi bi-facebook"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                </svg>
              </a>
            </li>
          </ul>
        </footer>
      </body>
    </html>
  );
}
