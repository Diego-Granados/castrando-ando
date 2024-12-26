import StorageController from "@/controllers/StorageController";
import { NextResponse } from "next/server";
export async function POST(req) {
  const formData = await req.formData();
  const files = formData.getAll("files");
  const path = formData.get("path");
  console.log(files, path);
  try {
    const downloadURLs = await StorageController.uploadFiles(files, path);
    return NextResponse.json(downloadURLs);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
