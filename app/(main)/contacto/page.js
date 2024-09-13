import Image from "next/image";
import { Form } from "react-bootstrap";
import ContactForm from "./ContactoForm";


function Contacto() {
  async function contacto(params) {
    "use server";

    //Se debe mandar los correos
  }

  return (
    <main className="container">
      <h1>Contáctenos</h1>
      <div className="row">
        <div className="col" id="form">
          <ContactForm contacto={contacto}></ContactForm>
        </div>
        <div className="col" id="img&sinpe">
            <img src="https://www.pdsa.org.uk/media/7646/golden-retriever-gallery-2.jpg?anchor=center&mode=crop&quality=100&height=500&bgcolor=fff&rnd=133020229510000000"/>
            <p className="mt-3">
              Si desea realizar donaciones o llamarnos, puede realizar un Sinpe a
              los siguientes números de teléfono:
            </p>
            <ul>
              <li>8594-7283: Lorena Jiménez</li>
              <li>8585-8505: Lorena Jiménez</li>
            </ul>
        </div>
      </div>
    </main>
  );
}

export default Contacto;
{/* <h1 className="">Asociación Animalitos Abandonados</h1>
      <h2>Contáctanos</h2>
      <div>
        <p>
          Si desea realizar donaciones o llamarnos, puede realizar un Sinpe a
          los siguientes números de teléfono:
        </p>
        <ul>
          <li>8594-7283: Lorena Jiménez</li>
          <li>8585-8505: Lorena Jiménez</li>
        </ul>
      </div> */}