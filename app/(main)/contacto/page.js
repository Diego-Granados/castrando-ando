import Image from "next/image";
import { Form, Card } from "react-bootstrap";
import ContactForm from "./ContactoForm";
import NewsletterForm from "./NewsletterForm";
import { Weight } from "lucide-react";

function Contacto() {
  return (
    <main className="container">
      <h1>Contáctenos</h1>
      <div className="card pt-5 px-5 mb-4">
        <div className="row">
          <div className="col" id="form">
            <ContactForm />
          </div>
          <div className="col" id="img&sinpe">
            <img
              style={{ objectFit: "contain" }}
              src="https://www.pdsa.org.uk/media/7646/golden-retriever-gallery-2.jpg?anchor=center&mode=crop&quality=100&height=500&bgcolor=fff&rnd=133020229510000000"
            />
            <p className="mt-3">
              Si desea realizar donaciones o llamarnos, puede realizar un Sinpe
              a los siguientes números de teléfono:
            </p>
            <ul>
              <li>8594-7283: Lorena Jiménez</li>
              <li>8585-8505: Lorena Jiménez</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription Section */}
      <NewsletterForm />
    </main>
  );
}

export default Contacto;
