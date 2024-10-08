import Image from "next/image";

export default function Ayuda() {
  return (
    <main className="container mx-auto">
      <h1 className="text-center" style={{color:'#2055A5'}}>Ayuda</h1>
      
      <div className="row mt-5">
        <h2 className="text-center">¿Cómo registrarse?</h2>
        <hr style={{ borderTop: '2px solid #ccc', margin: '20px 0' }} />
        <div className="row" style={{width:'auto'}} >
          <article>
            <p>
              <font size='5'>Para registrarse en una campaña, primero hay que estar en la página de "Campañas" , la cual se puede acceder presionando el "Campañas" o el logo de la asociación en el menú superior, y presionar el botón que dice "Agendar Cita" de la campaña en la que se desea participar.
              </font>
            </p>
          </article>
        </div>
        <div className="d-flex justify-content-center w-100">
          <img className="img-fluid row" style={{maxHeight:'50vh', width:'auto'}} src="https://firebasestorage.googleapis.com/v0/b/animalitos-db3ff.appspot.com/o/Ayuda%2FPaso%201.png?alt=media&token=46a98ee5-aabd-454e-9451-0fdf1a7ff02d"></img>
        </div>
      </div>

      <div className="container row mt-5">
        <article className="row">
          <p>
            <font size='5'>Luego, se entra a una página donde se da más información de la campaña. Para registrar una cita, se presiona el botón que dice "AGENDAR CITA".
            </font>
          </p>
        </article>
        <div className="d-flex justify-content-center w-100">
          <img className="img-fluid row" style={{maxHeight:'50vh', width:'auto'}} src="https://firebasestorage.googleapis.com/v0/b/animalitos-db3ff.appspot.com/o/Ayuda%2FPaso%202.png?alt=media&token=de8e0374-99c5-4e9b-8d94-1ba1771bcc99"></img>
        </div>
      </div>

      <div className="container row mt-5">
        <article className="row">
          <p>
            <font size='5'>Esto nos lleva a las horas disponibles de la campaña. Se debe seleccionar la hora a conveniencia del dueño de la mascota y que tenga cupos disponibles. Se presiona el botón de "AGENDAR CITA".
            </font>
          </p>
        </article>
        <div className="d-flex justify-content-center w-100">
          <img className="img-fluid row" style={{maxHeight:'50vh', width:'auto'}} src="https://firebasestorage.googleapis.com/v0/b/animalitos-db3ff.appspot.com/o/Ayuda%2FPaso%203.png?alt=media&token=d3ee62cc-5599-45f3-a2d0-a74c58fc9d91"></img>
        </div>
      </div>

      <div className="container row mt-5">
        <article className="row">
          <p>
            <font size='5'>Finalmente, se ingresa la información del animal y se presiona el botón de "Reservar".
            </font>
          </p>
        </article>
        <div className="d-flex justify-content-center w-100">
         <img className="img-fluid row" style={{maxHeight:'50vh', width:'auto'}} src="https://firebasestorage.googleapis.com/v0/b/animalitos-db3ff.appspot.com/o/Ayuda%2FPaso%204.png?alt=media&token=0aa96437-9bf9-48d0-8510-5121361f1ff2"></img>
        </div>
      </div>

      <div className="container row mt-5">
        <h2 className="text-center">¿Cómo revisar las citas o modificarlas?</h2>
        <hr style={{ borderTop: '2px solid #ccc', margin: '20px 0' }} />
        <article className="row">
          <p>
            <font size='5'>Para revisar o modificar las citas en las que se está inscrito, se debe entrar a la página de "Citas", la cual se puede acceder presionando "Citas" en el menú superior.
            </font>
          </p>
        </article>
        <div className="d-flex justify-content-center w-100">
          <img className="img-fluid row" style={{maxHeight:'50vh', width:'auto'}} src="https://firebasestorage.googleapis.com/v0/b/animalitos-db3ff.appspot.com/o/Ayuda%2FCitas.png?alt=media&token=bb95efbf-fe1c-4cf8-bc52-e4b25f80f13d"></img>
        </div>
      </div>

      <div className="container row mt-5">
        <article className="row">
          <p>
            <font size='5'>Luego, se debe ingresar el número de cédula y presionar el botón de "Consultar". Esto despliega la información de las citas en las que se está inscrito.
            </font>
          </p>
        </article>
        <div className="d-flex justify-content-center w-100">
          <img className="img-fluid row" style={{maxHeight:'50vh', width:'auto'}} src="https://firebasestorage.googleapis.com/v0/b/animalitos-db3ff.appspot.com/o/Ayuda%2FRevisar%20citas.png?alt=media&token=7324268a-7f28-4b37-acd4-29c0b29104d1"></img>
        </div>
      </div>

      <div className="container row mt-5">
        <article className="row">
          <p>
            <font size='5'>Finalmente, para modificar o cancelar la cita, se presiona el botón de "Modificar" o "Cancelar", respectivamente. Si queremos modificarla, se abre un formulario con la información del animal, la cual podemos cambiar y guardar con el botón de "Guardar cambios".
            </font>
          </p>
        </article>
        <div className="d-flex justify-content-center w-100">
          <img className="img-fluid row" style={{maxHeight:'50vh', width:'auto'}} src="https://firebasestorage.googleapis.com/v0/b/animalitos-db3ff.appspot.com/o/Ayuda%2FEditar%20Cita.png?alt=media&token=9ebcceba-1075-4a86-9991-4982f7fcfe31"></img>
        </div>
      </div>

      <div className="container row mt-5">
        <h2 className="text-center">¿No recibiste tu correo de confirmación?</h2>
        <hr style={{ borderTop: '2px solid #ccc', margin: '20px 0' }} />
        <article className="row">
          <p>
            <font size='5'>En caso de no recibir tu correo de confirmación o cancelación de cita, revisa la carpeta "Spam" de tu correo electrónico. </font>
          </p>
        </article>
        <div className="d-flex justify-content-center w-100">
          <img className="img-fluid row" style={{maxHeight:'50vh', width:'auto'}} src="https://firebasestorage.googleapis.com/v0/b/animalitos-db3ff.appspot.com/o/Ayuda%2FSpam.png?alt=media&token=03efae6e-f970-457f-b6b4-727309f1527d"></img>
        </div>
      </div>


    </main>
  );
}
