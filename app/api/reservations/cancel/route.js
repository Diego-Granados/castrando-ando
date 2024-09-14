import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { ref, increment, update } from "firebase/database";

export async function POST(req) {
  try {
    const { formData } = await req.json();
    console.log("CANCEL", formData);

    const updates = {};

    updates[`campaigns/${formData.campaignId}/available`] = increment(1);
    updates[
      `inscriptions/${formData.campaignId}/${formData.timeslot}/available`
    ] = increment(1);

    const appointmentKey = formData.appointmentKey;
    updates[
      `inscriptions/${formData.campaignId}/${formData.timeslot}/appointments/${appointmentKey}/enabled`
    ] = false;

    updates[`/appointments/${formData.id}/${appointmentKey}/enabled`] = false;

    await update(ref(db), updates);
    return NextResponse.json({ message: "Appointment canceled correctly!" });
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}
