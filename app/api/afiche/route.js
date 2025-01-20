import { createCanvas, loadImage, registerFont } from "canvas";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request) {
  try {
    const data = await request.json();
    const {
      title,
      date,
      startTime,
      endTime,
      place,
      description,
      phone,
      pricesData,
      priceSpecial,
      requirements,
    } = data;

    // Load the template image first to get its dimensions
    const templateImage = await loadImage(
      path.join(process.cwd(), "private", "aficheTemplate.jpg")
    );

    // Create canvas with template dimensions
    const canvas = createCanvas(templateImage.width, templateImage.height);
    const ctx = canvas.getContext("2d");

    // Draw template image
    ctx.drawImage(templateImage, 0, 0);

    // Set up text styles
    ctx.textAlign = "center";
    ctx.fillStyle = "#009dfb";

    // Calculate width for text wrapping (80% of canvas width)
    const textWidth = canvas.width * 0.98;

    // Start drawing from 5% of the height
    let y = canvas.height * 0.05;

    // Draw title
    ctx.font = `800 ${canvas.width * 0.06}px Arial`;
    const titleLines = wrapText(ctx, title.toUpperCase(), textWidth);
    titleLines.forEach((line) => {
      ctx.fillText(line, canvas.width / 2, y);
      y += canvas.width * 0.065;
    });

    // Draw prices
    ctx.fillStyle = "#080808";
    ctx.font = `bold ${canvas.width * 0.032}px Arial`;
    ctx.fillText("PRECIOS", canvas.width / 2, y);
    y += canvas.width * 0.04;
    ctx.font = `bold ${canvas.width * 0.032}px Arial`;
    pricesData.forEach(({ price, weight }) => {
      if (weight < 100) {
        ctx.fillText(
          `${weight}kg o menos: ₡${formatNumber(price)}`,
          canvas.width / 2,
          y
        );
      } else {
        ctx.fillText(
          `Más de ${
            pricesData[pricesData.length - 2].weight
          }kg: ₡${formatNumber(price)}`,
          canvas.width / 2,
          y
        );
      }
      y += canvas.width * 0.04;
    });

    // Draw special price
    const specialPriceLines = wrapText(
      ctx,
      `*APLICAN RESTRICCIONES EN CASOS ESPECIALES* +₡${formatNumber(
        priceSpecial
      )}`,
      textWidth
    );
    specialPriceLines.forEach((line) => {
      ctx.fillText(line, canvas.width / 2, y);
      y += canvas.width * 0.045;
    });

    // Draw description
    y += canvas.width * 0.01;
    ctx.font = `bold ${canvas.width * 0.035}px Arial`;
    ctx.fillStyle = "#eb922a";
    const descLines = wrapText(ctx, description, textWidth);
    descLines.forEach((line) => {
      ctx.fillText(line, canvas.width / 2, y);
      y += canvas.width * 0.045;
    });

    // Draw date and time
    y += canvas.width * 0.04;
    ctx.font = `bold ${canvas.width * 0.06}px Arial`;
    ctx.fillStyle = "#4fc53d";
    const dateObj = new Date(date + "T12:00:00Z");
    const formattedDate = dateObj
      .toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .replace(/^\w/, (c) => c.toUpperCase());
    ctx.fillText(formattedDate, canvas.width / 2, y);
    // y += canvas.width * 0.055;
    // ctx.font = `bold ${canvas.width * 0.035}px Arial`;
    // ctx.fillText(`${startTime} - ${endTime}`, canvas.width / 2, y);

    // Draw place
    y += canvas.width * 0.055;
    ctx.font = `bold ${canvas.width * 0.04}px Arial`;
    ctx.fillStyle = "#004925";
    const placeLines = wrapText(ctx, place, textWidth);
    placeLines.forEach((line) => {
      ctx.fillText(line, canvas.width / 2, y);
      y += canvas.width * 0.055;
    });

    // Draw requirements
    y += canvas.width * 0.01;
    ctx.fillStyle = "#8c1a93";
    ctx.font = `bold ${canvas.width * 0.035}px Arial`;
    ctx.fillText("REQUISITOS", canvas.width / 2, y);
    y += canvas.width * 0.04;
    requirements.forEach((req) => {
      const reqLines = wrapText(ctx, `*${req}`, textWidth);
      reqLines.forEach((line) => {
        ctx.fillText(line, canvas.width / 2, y);
        y += canvas.width * 0.04;
      });
    });

    // Draw contact info
    y += canvas.width * 0.02;
    ctx.fillStyle = "#3c1f24";
    ctx.font = `bold ${canvas.width * 0.0355}px Arial`;
    const contactInfo = `CITAS: HACER CLICK EN EL LINK ADJUNTO A LA PUBLICACIÓN O ENVIAR UN MENSAJE AL WHATSAPP ${formatPhoneNumber(
      phone
    )} (NO ATENDEMOS LLAMADAS)`;
    const contactInfoLines = wrapText(ctx, contactInfo, textWidth);
    contactInfoLines.forEach((line) => {
      ctx.fillText(line, canvas.width / 2, y);
      y += canvas.width * 0.045;
    });

    // Draw logo
    const logoImage = await loadImage(
      path.join(process.cwd(), "public", "logo.jpg")
    );
    const logoWidth = canvas.width * 0.2; // 20% of canvas width
    const logoHeight = (logoImage.height * logoWidth) / logoImage.width;
    const logoX = (canvas.width - logoWidth) / 2;
    const logoY = y;
    ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
    y += logoHeight + canvas.width * 0.02; // Add some padding after logo

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/jpeg", { quality: 0.9 });

    // Return the image
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename=afichePerros-${date
          .split("-")
          .reverse()
          .join("-")}.jpg`,
      },
    });
  } catch (error) {
    console.error("Error generating poster:", error);
    return NextResponse.json(
      { error: "Error al generar el afiche" },
      { status: 500 }
    );
  }
}

// Helper function to wrap text
function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// Helper function to format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Helper function to format phone number
function formatPhoneNumber(phone) {
  const cleaned = phone.toString().replace(/\D/g, "");
  const match = cleaned.match(/^(\d{4})(\d{4})$/);
  if (match) {
    return match[1] + "-" + match[2];
  }
  return phone;
}
