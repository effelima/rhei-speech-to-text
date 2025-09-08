# RHEI - Internal Productivity Tool: Speech-to-Text Feature

This project is a functional MVP (Minimum Viable Product) of a Speech-to-Text application, built as part of the AI Product Builder Technical Assessment for RHEI.

The goal is to provide a simple and efficient internal tool for RHEI employees to quickly convert audio to text, addressing the need to transcribe day-to-day communications and reduce knowledge gaps.

---

## 🔴 Live Demo

You can test the deployed application here:

**soon**

---

## ✨ Features

* **Real-time Audio Recording:** Captures audio directly from the user's microphone using the browser's native capabilities.
* **AI-Powered Transcription:** Integrates with the Groq API, utilizing the Whisper-large-v3 model for fast and accurate speech-to-text conversion. [cite: 2]
* **Persistent Storage:** All transcriptions are saved to a Supabase PostgreSQL database, allowing users to see a history of their recordings.
* **Professional UI:** The user interface is clean, intuitive, and inspired by RHEI's official branding to feel like a genuine internal tool.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database:** Supabase (PostgreSQL)
* **AI Service:** Groq API (Whisper-large-v3)
* **Deployment:** Vercel

---

## 🚀 Getting Started

To run this project locally, follow these steps:

### 1\. Prerequisites

* Node.js (v18 or later)
* npm or yarn
* Git

### 2\. Clone the Repository

```bash
git clone [https://github.com/effelima/rhei-speech-to-text](https://github.com/effelima/rhei-speech-to-text)
cd [rhei-speech-to-text]
```

### 3\. Install Dependencies

```bash
npm install
```

### 4\. Set Up Environment Variables

Create a file named `.env.local` in the root of the project and add the following variables. You can get these keys from your Supabase and Groq project dashboards.

```bash
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL

# Supabase Public Anon Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Groq API Key
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

### 5\. Set Up the Database

This project uses the Supabase CLI to manage database migrations.

```bash
npm install supabase --save-dev
```

Next, log in and link your local project to your remote Supabase project:
Bash

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_ID
```

(You can find your YOUR_PROJECT_ID in your Supabase project's URL).

Finally, push the migration to create the transcriptions table in your database:
Bash

```bash
npx supabase db push
```

### 6\. Run the Development Server

```bash
npm run dev
```

The application should now be running on http://localhost:3000.