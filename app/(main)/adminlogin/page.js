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
    <main className="container mt-4">
      <h1>Ingreso para administradores de la aplicación</h1>
      <div className="mt-4">
        <LoginForm login_user={login_user} />
      </div>
    </main>
  );
}

export default Login;
