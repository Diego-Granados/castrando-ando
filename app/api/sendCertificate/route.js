import { NextResponse } from "next/server";
import { sendCertificateEmail } from "@/controllers/EmailSenderController";

export async function POST(request) {
  try {
    const { email, name, certificate } = await request.json();
    
    const certificateBuffer = Buffer.from(certificate, 'base64');
    
    const response = await sendCertificateEmail(email, name, certificateBuffer);
    
    if (!response.ok) {
      throw new Error("Failed to send certificate email");
    }

    return NextResponse.json({ message: "Certificate sent successfully" });
  } catch (error) {
    console.error("Error sending certificate:", error);
    return NextResponse.json(
      { error: "Error sending certificate" },
      { status: 500 }
    );
  }
} 