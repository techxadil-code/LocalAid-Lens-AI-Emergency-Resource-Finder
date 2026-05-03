import { z } from "zod";

// Schema for AI-extracted emergency data
export const EmergencyDataSchema = z.object({
  hospital_name: z.string().optional(),
  blood_group: z.string().optional(),
  category: z.enum([
    "blood",
    "oxygen",
    "shelter",
    "medicine",
    "rescue",
    "other",
  ]),
  urgency_keywords: z.array(z.string()),
  is_urgent: z.boolean(),
  contact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
  }),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }),
  raw_extracted_text: z.string(),
  summary: z.string(),
});

export type EmergencyData = z.infer<typeof EmergencyDataSchema>;

// Schema for emergency request in database
export const EmergencyRequestSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string(),
  submitted_by: z.string().optional(),
  raw_content: z.string().optional(),
  image_url: z.string().optional(),
  category: z.enum([
    "blood",
    "oxygen",
    "shelter",
    "medicine",
    "rescue",
    "other",
  ]),
  urgency_score: z.number().min(1).max(5),
  status: z.enum([
    "new",
    "verifying",
    "in_progress",
    "resolved",
    "duplicate",
    "expired",
  ]),
  structured_data: EmergencyDataSchema.optional(),
  contact_info: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  location_data: z
    .object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
  verification_flags: z.array(z.string()).optional(),
  assigned_to: z.string().uuid().optional().nullable(),
  resolved_at: z.string().optional().nullable(),
});

export type EmergencyRequest = z.infer<typeof EmergencyRequestSchema>;

// Categories with metadata
export const CATEGORIES = {
  blood: { label: "Blood", icon: "droplets", color: "hsl(0, 84%, 60%)" },
  oxygen: { label: "Oxygen", icon: "wind", color: "hsl(200, 84%, 60%)" },
  shelter: { label: "Shelter", icon: "home", color: "hsl(142, 71%, 45%)" },
  medicine: {
    label: "Medicine",
    icon: "pill",
    color: "hsl(262, 83%, 58%)",
  },
  rescue: { label: "Rescue", icon: "siren", color: "hsl(25, 95%, 53%)" },
  other: { label: "Other", icon: "circle-help", color: "hsl(220, 9%, 46%)" },
} as const;

// Urgency levels with metadata
export const URGENCY_LEVELS = {
  1: { label: "Low", color: "hsl(142, 71%, 45%)", bgClass: "bg-green-500/10" },
  2: {
    label: "Moderate",
    color: "hsl(47, 96%, 53%)",
    bgClass: "bg-yellow-500/10",
  },
  3: {
    label: "High",
    color: "hsl(25, 95%, 53%)",
    bgClass: "bg-orange-500/10",
  },
  4: {
    label: "Critical",
    color: "hsl(0, 84%, 60%)",
    bgClass: "bg-red-500/10",
  },
  5: {
    label: "Emergency",
    color: "hsl(0, 84%, 45%)",
    bgClass: "bg-red-700/10",
  },
} as const;
