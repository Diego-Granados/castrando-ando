import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import NavBar from "@/components/NavBar";
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
          <NavBar />
        </header>{" "}
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
