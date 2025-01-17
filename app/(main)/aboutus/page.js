import Image from "next/image";

export default function AboutUs() {
  return (
    <main className="container">
      <h1 className="text-center" style={{ color: "#2055A5" }}>
        Asociación Castrando Ando
      </h1>
      <section className="container row mt-5">
        <h2 className="text-center">¿Quiénes somos?</h2>
        <article className="col">
          <p>
            <font size="6">
              Somos una asociación que busca el bienestar de animalitos que se
              encuentren en situación de calle y necesiten nuestra ayuda para
              poder vivir una vida en perfectas condiciones
            </font>
          </p>
        </article>
        <img
          className="img-fluid col"
          style={{ maxHeight: "40vh", width: "auto" }}
          src="https://static.vecteezy.com/system/resources/thumbnails/005/857/332/small_2x/funny-portrait-of-cute-corgi-dog-outdoors-free-photo.jpg"
        ></img>
      </section>
      <section className="container row mt-5">
        <h2 className="mb-4 text-center">Indicaciones para las citas</h2>
        <img
          className="img-fluid col"
          style={{ maxHeight: "50vh", width: "auto" }}
          src="https://i.pinimg.com/564x/3b/68/d0/3b68d096d40b378ed567b506312b17c6.jpg"
        ></img>
        <article className="col">
          <font size="6">
            Para animales en perfecto estado de salud:
            <ul>
              <li>Animales con 12 horas de ayuno (comida y agua)</li>
            </ul>
          </font>
        </article>
      </section>
    </main>
  );
}
