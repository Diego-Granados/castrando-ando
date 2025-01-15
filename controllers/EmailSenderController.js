"use server";

import EmailSender from "@/models/EmailSender";

export async function sendContactEmail(msg, email, name, type) {
  return await EmailSender.sendContactEmail(msg, email, name, type);
}

export async function sendConfirmationEmail(email, name, hour, date, campaign) {
  return await EmailSender.sendConfirmationEmail(
    email,
    name,
    hour,
    date,
    campaign
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

export async function sendNewsletterEmail(email, name, newsletter) {
  return await EmailSender.sendNewsletterEmail(email, name, newsletter);
}
