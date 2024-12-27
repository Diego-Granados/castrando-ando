import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import LoginForm from "./LoginForm";
import { toast } from "react-toastify";
import { Quote } from "lucide-react";
import Link from "next/link";

function Login() {
  return (
    <main className="w-100">
      <div className="row px-0 py-0 h-100 w-100">
        <div
          className="col-md-4 d-none d-md-flex justify-content-center align-items-center px-0 h-100"
          style={{ backgroundColor: "#0d6efd" }}
        >
          <div className="">
            <img
              className="img-fluid"
              src="https://i.abcnewsfe.com/a/aabab413-962d-42ca-9993-10f91b8df83c/dogs-3-rf-gty-bb-240314_1710421856053_hpMain.jpg"
            ></img>
          </div>
        </div>
        <div className="col d-flex justify-content-center align-items-center">
          <div className="card shadow-sm col-md-6 justify-center w-75 p-3 sm:p-5">
            <div className="row">
              <h1>Ingrese como usuario</h1>
              <p className="mt-2">¡Bienvenido!</p>
              <p>Por favor, ingrese sus datos de acceso.</p>
            </div>
            <div className="row pl-5">
              <LoginForm />
            </div>
            <div className="row">
              <p>
                ¿No tienes una cuenta? <Link href="/registro">Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
