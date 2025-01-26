export async function sendNewsletterEmail(content, email, subject, photoUrl) {
  const smtpEmail = new SendSmtpEmail();
  try {
    smtpEmail.subject = subject;
    smtpEmail.to = [
      {
        email: email,
        name: email.split('@')[0]
      },
    ];
    
    // Add photo to content if exists
    const htmlContent = photoUrl 
      ? `${content}<br><br><img src="${photoUrl}" style="max-width: 100%;" />`
      : content;
    
    smtpEmail.htmlContent = htmlContent;
    smtpEmail.sender = {
      name: "Asociación de animalitos abandonados",
      email: "braytonss2002@gmail.com",
    };
    
    const result = await apiInstance.sendTransacEmail(smtpEmail);
    return { ok: true };
  } catch (error) {
    console.error("Error sending newsletter email:", error);
    return { ok: false };
  }
} 