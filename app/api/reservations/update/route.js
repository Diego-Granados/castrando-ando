import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { ref, update } from "firebase/database";

export async function POST(req) {
  try {
    const { formData } = await req.json();

    const updates = {};

    const appointmentKey = formData.appointmentKey;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/animal`
    ] = formData.animal;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/name`
    ] = formData.name;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/phone`
    ] = formData.phone;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/pet`
    ] = formData.pet;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/priceData`
    ] = formData.priceData;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/priceSpecial`
    ] = formData.priceSpecial;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/sex`
    ] = formData.sex;
    updates[
      `/inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/email`
    ] = formData.email;

    updates[`/users/${formData.id}`] = {
      phone: formData.phone,
      name: formData.name,
    };
    updates[`/appointments/${formData.id}/${appointmentKey}/animal`] =
      formData.animal;
    updates[`/appointments/${formData.id}/${appointmentKey}/pet`] =
      formData.pet;
    updates[`/appointments/${formData.id}/${appointmentKey}/priceData`] =
      formData.priceData;
    updates[`/appointments/${formData.id}/${appointmentKey}/priceSpecial`] =
      formData.priceSpecial;
    updates[`/appointments/${formData.id}/${appointmentKey}/sex`] =
      formData.sex;
    updates[`/appointments/${formData.id}/${appointmentKey}/phone`] =
      formData.phone;
    updates[`/appointments/${formData.id}/${appointmentKey}/email`] =
      formData.email;

    await update(ref(db), updates);
    return NextResponse.json({ message: "Appointment saved correctly!" });
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}
