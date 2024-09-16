"use server";
import brevo from "@getbrevo/brevo";

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.NEXT_PUBLIC_BREVO_API_KEY
);

const smtpEmail = new brevo.SendSmtpEmail();

export async function sendEmail(msg, correo, nombre, cedula) {
  console.log(msg, correo, nombre, cedula);
  try {
    smtpEmail.subject = nombre + " te quiere contactar!";
    smtpEmail.to = [
      {
        email: "braytonss2002@gmail.com",
        name: "Asociacion de Perritos Abandonados",
      },
    ];
    smtpEmail.textContent =
      "Utiliza el correo " +
      correo +
      " para comunicarte con " +
      nombre +
      ". Te envía este mensaje: " +
      msg;
    //smtpEmail.htmlContent = `<html></html>` //se puede usar este para hacer cosas mas personalizadas
    smtpEmail.sender = { name: nombre, email: "braytonss2002@gmail.com" };
    console.log(NEXT_PUBLIC_BREVO_API_KEY);
    const result = await apiInstance.sendTransacEmail(smtpEmail);
    console.log("Email enviado: ", result);
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
}
