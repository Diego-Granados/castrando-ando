"use server";

import EmailSender from "@/models/EmailSender";

export async function sendContactEmail(msg, email, name, type) {
  return await EmailSender.sendContactEmail(msg, email, name, type);
}

export async function sendConfirmationEmail(
  email,
  name,
  hour,
  date,
  campaign,
  campaignId,
  appointmentKey
) {
  return await EmailSender.sendConfirmationEmail(
    email,
    name,
    hour,
    date,
    campaign,
    campaignId,
    appointmentKey
  );
}

export async function sendCancelEmail(email, name, hour, date, campaign) {
  return await EmailSender.sendCancelEmail(email, name, hour, date, campaign);
}

export async function sendReminder(email, name, hour, date, campaign) {
  return await EmailSender.sendReminder(email, name, hour, date, campaign);
}

export async function sendReply(msg, mail, name, adminReply) {
  return await EmailSender.sendReply(msg, mail, name, adminReply);
}

export async function sendNewsletterEmail(content, email, subject) {
  return await EmailSender.sendNewsletterEmail(content, email, subject);
}

export async function sendActivityRegistrationEmail(email, name, activity) {
  return await EmailSender.sendActivityRegistrationEmail(email, name, activity);
}

export async function sendActivityDeregistrationEmail(email, name, activity) {
  return await EmailSender.sendActivityDeregistrationEmail(
    email,
    name,
    activity
  );
}

export async function sendCertificateEmail(email, name, certificateBuffer) {
  return await EmailSender.sendCertificateEmail(email, name, certificateBuffer);
}

export async function sendAfterSurgeryEmail(email, name) {
  return await EmailSender.sendAfterSurgeryEmail(email, name);
}
