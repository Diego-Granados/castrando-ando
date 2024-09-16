"use server";
import brevo from "@getbrevo/brevo";
import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  SendSmtpEmail,
} from "@getbrevo/brevo";

const apiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.NEXT_PUBLIC_BREVO_API_KEY
);

export async function sendEmail(msg, correo, nombre, cedula) {
  const smtpEmail = new SendSmtpEmail();
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
    const result = await apiInstance.sendTransacEmail(smtpEmail);
    return { ok: true };
  } catch (error) {
    return { ok: false };
  }
}
