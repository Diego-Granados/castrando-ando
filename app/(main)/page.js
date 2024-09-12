import Image from "next/image";
import Button from "react-bootstrap/Button"
import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <div className="row col-lg-6 px-5 my-5"  style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}>
        <div className="col">       
          <img src='' alt='imagen' />
        </div>
        <div className="col my-5">  
          <div className="campaign-info">
            <h2>Título</h2>
            <div className="">
              <p><strong>Fecha</strong> </p>
              <p><strong>Lugar</strong> </p>
              <p><strong>Cupos</strong></p>
            </div>
            <Button variant="primary" type="submit">
            Ver más
            </Button>
          </div>
          </div>
        </div>
      <Link href="adminlogin">Ingresar como administrador</Link>
    </main>
  );
}
