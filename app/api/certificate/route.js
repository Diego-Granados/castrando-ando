import { createCanvas, loadImage, registerFont } from "canvas";
import { NextResponse } from "next/server";
import path from "path";

// Register fonts
registerFont(path.join(process.cwd(), "fonts", "Montserrat-Bold.ttf"), {
  family: "Montserrat_Bold",
  weight: "bold",
});

export async function POST(request) {
  try {
    const data = await request.json();
    const { name } = data;

    // Load the certificate template
    const templateImage = await loadImage(
      path.join(process.cwd(), "private", "certificadoCastrandoAndo.jpg")
    );

    // Create canvas with template dimensions
    const canvas = createCanvas(templateImage.width, templateImage.height);
    const ctx = canvas.getContext("2d");

    // Draw template image
    ctx.drawImage(templateImage, 0, 0);

    // Configure text style for the name
    ctx.textAlign = "center";
    ctx.fillStyle = "#2b355e"; // Black color for the name
    ctx.font = "52px Montserrat_Bold";

    // Calculate vertical position (center of the image)
    const verticalPosition = templateImage.height * 0.51;

    // Draw the name
    ctx.fillText(name, templateImage.width / 2, verticalPosition);

    // Add current date
    const currentDate = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Costa_Rica"
    });
    
    
    ctx.font = "24px Montserrat_Bold";
    ctx.fillText(currentDate, templateImage.width / 2, templateImage.height * 0.56);

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/jpeg", { quality: 0.9 });

    // Format date for filename
    const dateForFilename = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/Costa_Rica"
    }).replace(/\//g, '-');

    // Return the image with updated filename
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename=Certificado-${name.replace(/\s+/g, "-")}-${dateForFilename}.jpg`,
      },
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    return NextResponse.json(
      { error: "Error al generar el certificado" },
      { status: 500 }
    );
  }
} 