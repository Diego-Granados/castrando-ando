import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { ref, update, get, child } from "firebase/database";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export async function deleteCampaign(formData) {
  try {
    let user = null;
    // Use onAuthStateChanged to get the current user
    await new Promise((resolve) => {
      onAuthStateChanged(auth, (currentUser) => {
        user = currentUser;
        resolve(); // Resolve the promise when the user is available
      });
    });

    if (!user) {
      console.log("User not authenticated");
      return NextResponse.error("User not authenticated", { status: 401 });
    }

    console.log(formData);

    const campaignId = formData.campaignId;
    const updates = {};
    updates[`/campaigns/${campaignId}/enabled`] = false;

    const snapshot = await get(child(ref(db), `inscriptions/${campaignId}`));
    if (!snapshot.exists()) {
      console.log("No data available");
      return NextResponse.error("No data available");
    }
    const inscriptions = snapshot.val();
    Object.keys(inscriptions).forEach((timeslot) => {
      if ("appointments" in inscriptions[timeslot]) {
        Object.keys(inscriptions[timeslot]["appointments"]).forEach(
          (appointment) => {
            const path = `/appointments/${inscriptions[timeslot]["appointments"][appointment]["id"]}/${appointment}`;
            updates[`${path}/enabled`] = false;
          }
        );
      }
    });

    await update(ref(db), updates);
    return NextResponse.json({ message: "Form data saved successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}
