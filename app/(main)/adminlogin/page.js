import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import LoginForm from "./LoginForm";
import { toast } from "react-toastify";

function Login() {
  return (
    <main className="">
      <div className="row px-0 py-0" style={{maxHeight:'100vh'}}>
          <div className="col-md-6 d-flex justify-content-center align-items-center px-0" style={{backgroundColor: 'blue'}}>
              <img class="img-fluid my-5 rounded max-height-20" src="https://i.pinimg.com/736x/c6/ab/8a/c6ab8a727ffc6784e59246e60f22b018.jpg"></img>
          </div>
          <div className="row flex items-center justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
