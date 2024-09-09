import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { ref, push, set } from "firebase/database";

export async function PUT(req) {
  try {
    const { formData } = await req.json();
    console.log(formData);

    const campaignRef = ref(db, "campaigns");
    console.log(1);
    const newCampaignRef = push(campaignRef);
    console.log(2);
    await set(newCampaignRef, formData);
    console.log(3);
    return NextResponse.json({ message: "Form data saved successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.error(error);
  }
}
