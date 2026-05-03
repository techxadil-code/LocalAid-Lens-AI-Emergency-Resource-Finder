# Offbeat — AI-Powered Emergency Response Platform 🆘⚡

**Turn Screenshots into Action.** Offbeat is a high-performance, real-time emergency response platform that uses Gemini AI to extract structured data from screenshots (WhatsApp, Twitter, etc.) and coordinate volunteer efforts instantly.

![Offbeat Landing Page Mockup](https://raw.githubusercontent.com/techxadil-code/LocalAid-Lens-AI-Emergency-Resource-Finder/main/public/og-image.png)

## 🚀 The Problem
During emergencies (natural disasters, medical crises), critical requests for blood, oxygen, or rescue are often scattered across social media and messaging apps as images. Volunteers lose precious time manually transcribing these details.

## ✨ The Solution: Offbeat
- **AI-Powered OCR**: Uses Gemini 1.5 Flash to accurately extract names, phone numbers, locations, and urgency levels from screenshots.
- **Structured Data**: Automatically categorizes requests (Blood, Oxygen, Shelter, etc.) and flags missing information.
- **Real-Time Dashboard**: Volunteers see new "Action Cards" instantly via Supabase Realtime without refreshing.
- **Coordinate**: Volunteers can "Take Charge" of a request, preventing duplicate efforts and tracking progress in real-time.

## 🛠️ Tech Stack
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) + **MongoDB Atlas**
- **Database/Realtime**: [Supabase](https://supabase.com/)
- **AI Engine**: [Google Gemini 1.5 Flash](https://aistudio.google.com/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest)

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18+
- Supabase Project
- MongoDB Atlas Cluster
- Google AI (Gemini) API Key
- Google Cloud Console Project (for OAuth)

### 2. Environment Setup
Create a `.env.local` file in the root directory and fill in the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MongoDB
MONGODB_URI=your_mongodb_uri

# NextAuth
AUTH_SECRET=your_secure_random_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_key
```

### 3. Database Initialization
Run the SQL found in `supabase-schema.sql` in your Supabase SQL Editor. This will create the `emergency_requests` table with RLS policies and Realtime enabled.

### 4. Installation
```bash
npm install
npm run dev
```

## 🏗️ Architecture
The system is built on a serverless, event-driven architecture. 
1. **Input**: User uploads a screenshot.
2. **Extraction**: Gemini AI processes the image and returns a validated JSON schema.
3. **Storage**: Data is saved to Supabase; images are stored in Supabase Buckets.
4. **Broadcast**: Supabase Realtime pushes the new card to all active volunteer dashboards.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
MIT License. Created by [techxadil-code](https://github.com/techxadil-code).
