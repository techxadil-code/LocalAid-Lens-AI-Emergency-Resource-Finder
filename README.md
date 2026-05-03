🛡️ LocalAid Lens: AI Emergency Resource Finder

LocalAid Lens is a civic-tech tool designed to bridge the gap between chaotic social media emergency posts and actionable volunteer coordination. By leveraging AI-powered OCR and structured data extraction, it transforms messy screenshots and text from WhatsApp, X (Twitter), and Instagram into verified, prioritized emergency action cards.

 🚀 The Problem
During local emergencies (medical crises, natural disasters, or resource shortages), information is scattered. Volunteers often waste critical time:
* Manually typing details from screenshots.
* Figuring out the exact location or urgency.
* Identifying missing information (like a missing hospital bed number or contact person).

✨ The Solution
LocalAid Lens acts as a "smart filter" for relief efforts. 
1.  **Input:** Paste a text request or upload a screenshot of a social media post.
2.  **Analyze:** AI (Gemini/GPT-4o-mini) extracts structured data: Need, Location, Contact, Urgency, and Deadline.
3.  **Action:** Generates a verified "Action Card," a volunteer call script, and a WhatsApp-ready sharing link.

---

🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14+ (App Router), Tailwind CSS, Shadcn UI |
| **Backend/BaaS** | Supabase (Auth, PostgreSQL, Edge Functions) |
| **AI/ML** | Gemini 1.5 Flash (Vision & OCR) |
| **Mapping** | Google Maps Platform |
| **Communication** | Twilio / WhatsApp API (Optional) |

---

🏗️ System Architecture

The application follows a modern serverless architecture for speed and scalability:

* **Client:** A responsive React dashboard built with Next.js.
* **Storage:** Images are stored in Supabase Buckets; metadata is indexed in PostgreSQL.
* **AI Engine:** Serverless API routes send media to Gemini 1.5 for "Zero-shot" extraction into structured JSON.
* **Real-time:** Supabase Real-time ensures that when one volunteer marks a request as "Verifying," it updates for everyone instantly.

---

## 📋 Key Features (MVP)
* 📷 **AI OCR & Extraction:** Instant conversion of images to structured data.
* 🚦 **Urgency Scoring:** Automatic categorization of requests (e.g., Critical, High, Moderate).
* ✅ **Verification Checklist:** AI detects missing fields and prompts volunteers to fill them.
* 📢 **Script Generator:** One-click generation of professional "Call Scripts" for re-verifying with the requester.
* 📍 **Geo-tagging:** Automatic generation of Google Maps links for hospital/shelter locations.

---

## 🚦 Getting Started

### Prerequisites
* Node.js (v18+)
* Supabase Account
* Google AI Studio API Key (for Gemini)

### Installation
1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/localaid-lens.git
   cd localaid-lens
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Setup Environment Variables:**
   Create a `.env.local` file and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   GOOGLE_AI_API_KEY=your_gemini_key
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🤝 Contributing
This is an open-source project aimed at helping communities. We welcome contributions from student volunteers and developers. Please check the `ISSUES` tab for "good first issues."

---

> **Note:** This project was developed to reduce chaos in local emergency management. In emergencies, clarity saves lives.
