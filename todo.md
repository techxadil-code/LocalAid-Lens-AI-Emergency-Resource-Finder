
## 🏗️ System Architecture Overview
The architecture is designed to be **serverless and event-driven**, ensuring it can scale during high-traffic emergencies without high maintenance costs.

### 1. Presentation Layer (The Frontend)
*   **Framework:** **Next.js (App Router)** is the better choice here over Vite because of built-in API routes and Image Optimization.
*   **UI/UX:** **Tailwind CSS** + **Shadcn UI** (for accessible, clean components like "Urgency Badges" and "Action Cards").
*   **State Management:** **React Query (TanStack)** to handle real-time updates from Supabase without constant page refreshes.

### 2. Processing Layer (The "Lens" Engine)
*   **Entry Point:** Next.js Server Actions or API Routes.
*   **AI Orchestration:**
    *   **Vision/OCR:** Use **Gemini 1.5 Flash** (highly efficient for text extraction from images).
    *   **Structured Output:** Use **JSON Mode** or **Function Calling** to ensure the AI returns a specific schema (e.g., `{ hospital_name: string, blood_group: string, is_urgent: boolean }`).
*   **Validation Logic:** A custom middleware to check if the AI-extracted data meets the "Minimum Viable Verification" (e.g., does it have a 10-digit phone number?).

### 3. Data & Infrastructure Layer (Supabase)
*   **Authentication:** Supabase Auth (OTP/Google Login for volunteers).
*   **Database (PostgreSQL):** 
    *   `Requests` table (ID, raw_text, structured_json, status, urgency_level, location_point).
    *   `Volunteers` table (ID, profile, verified_status).
*   **Storage:** Supabase Buckets to host the original screenshots for manual verification.
*   **Real-time:** Supabase Real-time to push new emergency cards to all active volunteer dashboards instantly.

---

## 🔄 Data Flow: From Screenshot to Card

| Step | Component | Action |
| :--- | :--- | :--- |
| **1. Input** | User | Pastes a WhatsApp screenshot or Twitter link. |
| **2. Storage** | Supabase Storage | The image is uploaded and a temporary URL is generated. |
| **3. Extract** | Gemini AI | OCR analyzes the image/text and maps it to your predefined JSON schema. |
| **4. Verify** | Logic Layer | The system flags missing info (e.g., "Missing Hospital Name") and generates a verification script. |
| **5. Publish** | Dashboard | A new "Action Card" appears on the live feed, color-coded by urgency. |
| **6. Act** | Volunteer | Clicks "Take Charge," updating the status to "Verifying" via Supabase Real-time. |

---

## 🛠️ Recommended Database Schema (Simplified)

```sql
-- Main Table for Emergency Requests
CREATE TABLE emergency_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  raw_content TEXT, -- The original text or image URL
  category TEXT, -- e.g., 'Blood', 'Oxygen', 'Shelter'
  urgency_score INT, -- 1 to 5
  status TEXT DEFAULT 'new', -- 'new', 'verifying', 'resolved', 'duplicate'
  contact_info JSONB, -- { "name": "...", "phone": "..." }
  location_data JSONB, -- { "address": "...", "lat": "...", "lng": "..." }
  assigned_to UUID REFERENCES profiles(id)
);
