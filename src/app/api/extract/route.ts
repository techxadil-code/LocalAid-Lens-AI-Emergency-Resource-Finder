import { NextRequest, NextResponse } from "next/server";
import { extractEmergencyData, extractFromText } from "@/lib/gemini";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;
    const userId = formData.get("userId") as string | null;

    if (!file && !text) {
      return NextResponse.json(
        { error: "Please provide an image file or text content" },
        { status: 400 }
      );
    }

    let extractionResult;

    if (file) {
      // Upload image to Firebase Storage
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `screenshots/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, buffer, {
        contentType: file.type,
      });

      // Get public URL
      const publicUrl = await getDownloadURL(storageRef);

      // Extract data using Gemini
      const base64 = buffer.toString("base64");
      extractionResult = await extractEmergencyData(base64, file.type);

      // Insert into Firestore
      const docRef = await addDoc(collection(db, "emergency_requests"), {
        submitted_by: userId || null,
        created_at: serverTimestamp(),
        raw_content: extractionResult.data.raw_extracted_text,
        image_url: publicUrl,
        category: extractionResult.data.category,
        urgency_score: extractionResult.urgencyScore,
        status: "new",
        structured_data: extractionResult.data,
        contact_info: extractionResult.data.contact,
        location_data: extractionResult.data.location,
        verification_flags: extractionResult.verificationFlags,
      });

      return NextResponse.json({
        success: true,
        requestId: docRef.id,
        verificationFlags: extractionResult.verificationFlags,
        urgencyScore: extractionResult.urgencyScore,
      });
    } else if (text) {
      // Extract from text
      extractionResult = await extractFromText(text);

      const docRef = await addDoc(collection(db, "emergency_requests"), {
        submitted_by: userId || null,
        created_at: serverTimestamp(),
        raw_content: text,
        category: extractionResult.data.category,
        urgency_score: extractionResult.urgencyScore,
        status: "new",
        structured_data: extractionResult.data,
        contact_info: extractionResult.data.contact,
        location_data: extractionResult.data.location,
        verification_flags: extractionResult.verificationFlags,
      });

      return NextResponse.json({
        success: true,
        requestId: docRef.id,
        verificationFlags: extractionResult.verificationFlags,
        urgencyScore: extractionResult.urgencyScore,
      });
    }
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process emergency request",
      },
      { status: 500 }
    );
  }
}
