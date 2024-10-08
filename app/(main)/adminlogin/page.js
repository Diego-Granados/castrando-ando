import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import LoginForm from "./LoginForm";
import { toast } from "react-toastify";
import { Quote } from "lucide-react";

function Login() {
  return (
    <main className="w-100">
      <div className="row px-0 py-0 h-100 w-100">
          <div className="col-md-4 d-none d-md-flex justify-content-center align-items-center px-0 h-100" style={{backgroundColor: 'blue' }}>
              <div className="">
                  <img className="img-fluid" src="https://i.pinimg.com/736x/c6/ab/8a/c6ab8a727ffc6784e59246e60f22b018.jpg"></img>
              </div>
          </div>
          <div className="col d-flex justify-content-center align-items-center">
            <div className="card shadow-sm col-md-6 justify-center w-75 p-5">
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
        </div>
    </main>
  );
}

export default Login;
