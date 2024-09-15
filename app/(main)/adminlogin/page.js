import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import LoginForm from "./LoginForm";
import { toast } from "react-toastify";
import { Quote } from "lucide-react";

function Login() {
  return (
    <main className="w-100">
      <div className="row px-0 py-0 w-100">
          <div className="col-md-4 justify-content-center align-items-center px-0" style={{backgroundColor: 'blue' }}>
              <img class="img-fluid my-5 rounded max-height-20" src="https://i.pinimg.com/736x/c6/ab/8a/c6ab8a727ffc6784e59246e60f22b018.jpg"></img>
          </div>
          <div className="col-md-6 items-center justify-center m-5">
            <div className="row">
              <h1>Ingrese como administrador</h1>
              <p className="mt-2">¡Bienvenido!</p>
              <p>Por favor, ingrese sus datos de acceso.</p>
            </div>
            <div className="row m-5 w-75 pl-5">
              <LoginForm />
            </div>
          </div>
        </div>
    </main>
  );
}

export default Login;
