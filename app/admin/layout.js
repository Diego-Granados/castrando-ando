import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import NavBarAdmin from "@/components/NavBarAdmin";
import { ToastContainer } from "react-toastify";
export const metadata = {
  title: "Asociación Animalitos Abandonados",
  description: "Sitio de la Asociación Animalitos Abandonados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <NavBarAdmin />
        </header>{" "}
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
