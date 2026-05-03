# Offbeat — AI-Powered Emergency Response Platform 🆘⚡

**Turn Screenshots into Action.** Offbeat is a high-performance, real-time emergency response platform that uses Gemini AI to extract structured data from screenshots (WhatsApp, Twitter, etc.) and coordinate volunteer efforts instantly.

## 🚀 The Problem
During emergencies (natural disasters, medical crises), critical requests for blood, oxygen, or rescue are often scattered across social media and messaging apps as images. Volunteers lose precious time manually transcribing these details.

## ✨ The Solution: Offbeat
- **AI-Powered OCR**: Uses Gemini 1.5 Flash to accurately extract names, phone numbers, locations, and urgency levels from screenshots.
- **Structured Data**: Automatically categorizes requests (Blood, Oxygen, Shelter, etc.) and flags missing information.
- **Real-Time Dashboard**: Volunteers see new "Action Cards" instantly via Firebase Firestore real-time listeners.
- **Coordinate**: Volunteers can "Take Charge" of a request, preventing duplicate efforts and tracking progress in real-time.

## 🛠️ Tech Stack
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Backend/Database**: [Firebase (Firestore)](https://firebase.google.com/products/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth) (Google Sign-In)
- **Storage**: [Firebase Storage](https://firebase.google.com/products/storage)
- **AI Engine**: [Google Gemini 1.5 Flash](https://aistudio.google.com/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest)

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 18+
- Firebase Project
- Google AI (Gemini) API Key

### 2. Environment Setup
Create a `.env.local` file in the root directory and fill in your Firebase config:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI
GEMINI_API_KEY=your_gemini_key
```

### 3. Firebase Setup
1. Enable **Google Auth** in Firebase Authentication.
2. Create a **Firestore** database (Start in Test Mode).
3. Enable **Firebase Storage**.

### 4. Installation
```bash
npm install
npm run dev
```

## 🏗️ Architecture
1. **Input**: User uploads a screenshot or pastes text.
2. **Extraction**: Gemini AI processes the input and returns validated JSON data.
3. **Storage**: Images go to Firebase Storage; structured data is saved to Firestore.
4. **Real-time**: All active dashboards receive updates instantly via Firestore `onSnapshot`.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
MIT License. Created by [techxadil-code](https://github.com/techxadil-code).
