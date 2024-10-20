import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { ref, increment, push, update } from "firebase/database";

export async function POST(req) {
  try {
    const { formData } = await req.json();

    const updates = {};

    updates[`campaigns/${formData.campaignId}/available`] = increment(-1);
    updates[
      `inscriptions/${formData.campaignId}/${formData.timeslot}/available`
    ] = increment(-1);

    const inscriptionRef = ref(
      db,
      `inscriptions/${formData.campaignId}/${formData.timeslot}/appointments`
    );
    const newInscriptionRef = push(inscriptionRef);
    updates[
      `inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${newInscriptionRef.key}`
    ] = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      pet: formData.pet,
      animal: formData.animal,
      sex: formData.sex,
      priceData: formData.priceData,
      priceSpecial: formData.priceSpecial,
      enabled: true,
      paid: false,
    };

    updates[`/users/${formData.id}`] = {
      phone: formData.phone,
      email: formData.email,
      name: formData.name,
    };
    updates[`/appointments/${formData.id}/${newInscriptionRef.key}`] = {
      campaignId: formData.campaignId,
      timeslot: formData.timeslot,
      campaign: formData.campaign,
      date: formData.date,
      place: formData.place,
      email: formData.email,
      phone: formData.phone,
      animal: formData.animal,
      sex: formData.sex,
      pet: formData.pet,
      priceData: formData.priceData,
      priceSpecial: formData.priceSpecial,
      enabled: true,
    };

    await update(ref(db), updates);
    return NextResponse.json({ message: "Appointment saved correctly!" });
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}
