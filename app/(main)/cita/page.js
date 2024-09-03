import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"

export default function Cita() {
  return (
    <main className="row"> 
      <div class="col-lg-6 px-5">
        <form>
          <div class="my-3">
            <label for="InputCedula" class="form-label">Cédula</label>
            <input type="text" placeholder="Cédula" class="form-control" id="InputCedula" aria-describedby="emailHelp"/>
          </div>
          <div class="mb-3">
            <label for="InputNombre" class="form-label">Nombre completo</label>
            <input placeholder="Nombre completo" type="text" class="form-control" id="InputNombre"/>
          </div>
          <div class="mb-3">
            <label for="InputTelefono" class="form-label">Teléfono</label>
            <input placeholder="Teléfono" type="number" class="form-control" id="InputTelefono"/>
          </div>
          <div class="form-check my-3">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="10kg"/>
            <label class="form-check-label" for="10kg">
              Hasta 10 kg (13000)
            </label>
          </div>
          <div class="form-check my-3">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="15kg"/>
            <label class="form-check-label" for="15kg">
              Hasta 15 kg (16000)
            </label>
          </div>
          <div class="form-check my-3">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="20kg"/>
            <label class="form-check-label" for="20kg">
              Hasta 20 kg (22000)
            </label>
          </div>
          <div class="form-check my-3">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="+20kg"/>
            <label class="form-check-label" for="+20kg">
              Más de 20 kg (26000)
            </label>
          </div>
          <div class="form-check my-3">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="especial"/>
            <label class="form-check-label" for="especial">
              ¿Caso especial? (preñez, celo, piometra, etc...) + 5000
            </label>
          </div>
          <button type="submit" class="btn btn-primary">Reservar</button>
        </form>
      </div>
      <div class="col-lg-6">
          <img class="m-5 w-75 rounded align-self-center" src="https://pawsonwheels.pet/wp-content/uploads/2023/11/chjpdmf0zs9sci9pbwfnzxmvd2vic2l0zs8ymdizlta4l3jhd3bpegvsx29mzmljzv8xnv9wag90b19vzl9hx2rvz19ydw5uaw5nx3dpdghfb3duzxjfyxrfcgfya19lcf9mm2i3mdqyzc0znwjlltrlmtqtogzhny1ky2q2owq1yzqzzjlfmi5qc.webp?resize=800%2C533"></img>
      </div>
    </main>
  )
}
