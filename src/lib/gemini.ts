import { GoogleGenerativeAI } from "@google/generative-ai";
import { EmergencyDataSchema, type EmergencyData } from "./schemas";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const EXTRACTION_PROMPT = `You are an emergency data extraction system. Analyze the provided image (a screenshot from WhatsApp, Twitter, or similar messaging platforms) and extract emergency information.

Return a JSON object with the following structure:
{
  "hospital_name": "name of hospital if mentioned (optional)",
  "blood_group": "blood group if mentioned, e.g., 'A+', 'O-' (optional)",
  "category": one of "blood", "oxygen", "shelter", "medicine", "rescue", or "other",
  "urgency_keywords": ["list", "of", "urgency", "keywords", "found"],
  "is_urgent": true/false based on the overall urgency of the message,
  "contact": {
    "name": "contact person name if found (optional)",
    "phone": "phone number if found (optional)"
  },
  "location": {
    "address": "full address if mentioned (optional)",
    "city": "city name if mentioned (optional)",
    "state": "state name if mentioned (optional)"
  },
  "raw_extracted_text": "the complete text extracted from the image",
  "summary": "a brief 1-2 sentence summary of the emergency request"
}

Rules:
1. Extract ALL text from the image accurately
2. Categorize the emergency correctly based on the content
3. If urgency keywords like "URGENT", "EMERGENCY", "ASAP", "CRITICAL" are found, set is_urgent to true
4. Extract phone numbers in their original format
5. If information is not available, use null for optional fields
6. Always provide a clear summary of what the emergency is about

Return ONLY the JSON object, no additional text.`;

export async function extractEmergencyData(
  imageBase64: string,
  mimeType: string = "image/jpeg"
): Promise<{
  data: EmergencyData;
  verificationFlags: string[];
  urgencyScore: number;
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    EXTRACTION_PROMPT,
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ]);

  const response = result.response;
  const text = response.text();

  // Parse JSON from response (handle markdown code blocks)
  let jsonStr = text;
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);
  const validated = EmergencyDataSchema.parse(parsed);

  // Run Minimum Viable Verification checks
  const verificationFlags: string[] = [];

  if (!validated.contact.phone) {
    verificationFlags.push("Missing phone number");
  } else if (!/^\+?\d{10,15}$/.test(validated.contact.phone.replace(/[\s-]/g, ""))) {
    verificationFlags.push("Phone number format may be invalid");
  }

  if (!validated.contact.name) {
    verificationFlags.push("Missing contact name");
  }

  if (!validated.location.address && !validated.location.city) {
    verificationFlags.push("Missing location information");
  }

  if (validated.category === "blood" && !validated.blood_group) {
    verificationFlags.push("Blood request missing blood group");
  }

  if (validated.category === "blood" && !validated.hospital_name) {
    verificationFlags.push("Blood request missing hospital name");
  }

  // Calculate urgency score (1-5)
  let urgencyScore = 2; // default moderate
  if (validated.is_urgent) urgencyScore += 2;
  if (validated.urgency_keywords.length > 2) urgencyScore += 1;
  if (validated.category === "rescue") urgencyScore += 1;
  if (validated.category === "blood" || validated.category === "oxygen")
    urgencyScore += 1;
  urgencyScore = Math.min(5, Math.max(1, urgencyScore));

  return { data: validated, verificationFlags, urgencyScore };
}

// Extract from text (for when users paste text instead of images)
export async function extractFromText(
  text: string
): Promise<{
  data: EmergencyData;
  verificationFlags: string[];
  urgencyScore: number;
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const textPrompt = EXTRACTION_PROMPT.replace(
    "Analyze the provided image (a screenshot from WhatsApp, Twitter, or similar messaging platforms)",
    "Analyze the provided text (copied from WhatsApp, Twitter, or similar messaging platforms)"
  );

  const result = await model.generateContent([textPrompt, text]);
  const response = result.response;
  const responseText = response.text();

  let jsonStr = responseText;
  const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);
  const validated = EmergencyDataSchema.parse(parsed);

  const verificationFlags: string[] = [];

  if (!validated.contact.phone) {
    verificationFlags.push("Missing phone number");
  }
  if (!validated.contact.name) {
    verificationFlags.push("Missing contact name");
  }
  if (!validated.location.address && !validated.location.city) {
    verificationFlags.push("Missing location information");
  }

  let urgencyScore = 2;
  if (validated.is_urgent) urgencyScore += 2;
  if (validated.urgency_keywords.length > 2) urgencyScore += 1;
  if (validated.category === "rescue") urgencyScore += 1;
  urgencyScore = Math.min(5, Math.max(1, urgencyScore));

  return { data: validated, verificationFlags, urgencyScore };
}
