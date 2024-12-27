import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow  ">
            <div className="card-body">
              <h2 className="text-center mb-4">Registro de Usuario</h2>
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
