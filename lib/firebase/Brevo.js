"use server";
import brevo from '@getbrevo/brevo'

const apiInstance = new brevo.TransactionalEmailsApi()

apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
)

const smtpEmail = new brevo.SendSmtpEmail()

export async function sendEmail(msg, correo, nombre, cedula) {
    console.log(
        msg,
        correo,
        nombre,
        cedula    
    )
    try{
        smtpEmail.subject = nombre + " te quiere contactar!" + "\nUtiliza el correo " + correo + " para comunicarte";
        smtpEmail.to = [
            {email: "brayton2011@hotmail.es", name: "Asociacion de Perritos Abandonados"}
        ];
        smtpEmail.textContent = msg;
        //smtpEmail.htmlContent = `<html></html>` //se puede usar este para hacer cosas mas personalizadas
        smtpEmail.sender = {name: nombre, email: "brayton2011@hotmail.es"};

        console.log(smtpEmail.sender.email, smtpEmail.sender.name)

        await apiInstance.sendTransacEmail(smtpEmail);

    }catch(error){
        console.log(error);
    }    
}