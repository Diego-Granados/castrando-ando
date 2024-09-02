import "bootstrap/dist/css/bootstrap.min.css";

import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Asociación Animalitos Abandonados",
  description: "Sitio de la Asociación Animalitos Abandonados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {" "}
        <NavBar />
        {children}
      </body>
    </html>
  );
}
