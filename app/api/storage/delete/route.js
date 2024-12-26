import { NextResponse } from "next/server";
import StorageController from "@/controllers/StorageController";

export async function POST(request) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: "Invalid request. 'urls' array is required" },
        { status: 400 }
      );
    }

    await StorageController.deleteFiles(urls);

    return NextResponse.json({ message: "Files deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
