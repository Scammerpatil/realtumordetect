import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const IMAGE_PATH = "python/image.jpg";

export async function POST(req: NextRequest) {
  if (fs.existsSync("public/image.jpg")) {
    fs.unlinkSync("public/image.jpg");
  }
  const formData = await req.formData();
  const image = formData.get("image") as File;
  if (!image) {
    return NextResponse.json({ message: "No image uploaded" }, { status: 400 });
  }
  const buffer = await image.arrayBuffer();
  const imageBuffer = Buffer.from(buffer);
  fs.writeFileSync(IMAGE_PATH, imageBuffer);
  try {
    const script = "py -3.10 python/detect.py";
    const { stdout, stderr } = await execAsync(script);
    if (stderr) {
      console.log(stderr);
    }
    var label = stdout.trim().split("\n").pop();
    return NextResponse.json(
      { label, imageUrl: "/image.jpg" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error processing image" },
      { status: 500 }
    );
  }
}
