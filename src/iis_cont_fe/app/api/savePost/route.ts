import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(),"public");

    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });

    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // const buffer = Buffer.from(await file.toString);
    if(!buffer){
      console.log("buffer bad")
      return NextResponse.json({ error: "Buffer error" }, { status: 500 });
    }
    
    const filename = file.name.replace(" ","_");
    if(!filename){
      return NextResponse.json({ error: "File name error" }, { status: 500 });
    }
    
    await writeFile(
      path.join(uploadDir, filename),
      buffer
    );
    
    return NextResponse.json({ 
      success: true,
      message: "File uploaded successfully",
      filepath: `${filename}`

    });

  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to save file" 
    }, { status: 500 });
  }
}
