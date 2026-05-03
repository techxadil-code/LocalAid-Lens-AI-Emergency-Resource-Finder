import { NextRequest, NextResponse } from "next/server";
import { extractEmergencyData, extractFromText } from "@/lib/gemini";
import { createClient } from "@supabase/supabase-js";

// Use service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

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
      // Upload image to Supabase Storage
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");

      const fileName = `screenshots/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("emergency-images")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("emergency-images").getPublicUrl(fileName);

      // Extract data using Gemini
      extractionResult = await extractEmergencyData(base64, file.type);

      // Insert into database
      const { data: record, error: insertError } = await supabase
        .from("emergency_requests")
        .insert({
          submitted_by: userId || null,
          raw_content: extractionResult.data.raw_extracted_text,
          image_url: publicUrl,
          category: extractionResult.data.category,
          urgency_score: extractionResult.urgencyScore,
          status: "new",
          structured_data: extractionResult.data,
          contact_info: extractionResult.data.contact,
          location_data: extractionResult.data.location,
          verification_flags: extractionResult.verificationFlags,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to save emergency request" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        request: record,
        verificationFlags: extractionResult.verificationFlags,
        urgencyScore: extractionResult.urgencyScore,
      });
    } else if (text) {
      // Extract from text
      extractionResult = await extractFromText(text);

      const { data: record, error: insertError } = await supabase
        .from("emergency_requests")
        .insert({
          submitted_by: userId || null,
          raw_content: text,
          category: extractionResult.data.category,
          urgency_score: extractionResult.urgencyScore,
          status: "new",
          structured_data: extractionResult.data,
          contact_info: extractionResult.data.contact,
          location_data: extractionResult.data.location,
          verification_flags: extractionResult.verificationFlags,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to save emergency request" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        request: record,
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
