import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import LoginForm from "./LoginForm";
import { toast } from "react-toastify";

function Login() {
  async function login_user(formData) {
    "use server";
    const rawFormData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log(rawFormData);

    signInWithEmailAndPassword(auth, rawFormData.email, rawFormData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log("SUCCESS");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("FAILURE");
      });
  }

  return (
    <main className="">
      <div className="row px-0 py-0" style={{maxHeight:'100vh'}}>
          <div className="col-md-6 d-flex justify-content-center align-items-center px-0" style={{backgroundColor: 'blue'}}>
              <img class="img-fluid my-5 rounded max-height-20" src="https://i.pinimg.com/736x/c6/ab/8a/c6ab8a727ffc6784e59246e60f22b018.jpg"></img>
          </div>
          <div className="col-md-5 p-5 rounded-start-3 bg-F4F6F0">
              <div className="row">
                <h1 className="display-6 my-4 text-lg-start">Inicia sesión</h1>
                <p>¡Bienvenido!</p>
                <p>Por favor, ingrese sus datos de acceso</p>
              </div>
              <div className="row flex items-center justify-center">
                <LoginForm login_user={login_user} />
              </div>
              
          </div>
      </div>
    </main>
  );
}

export default Login;
