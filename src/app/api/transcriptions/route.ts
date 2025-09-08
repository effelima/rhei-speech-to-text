// src/app/api/transcriptions/route.ts
import { SupabaseTranscriptionRepository } from "@/lib/repositories/impl/SupabaseTranscriptionRepository";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function GET() {
  try {
    const transcriptionRepository = await SupabaseTranscriptionRepository.create();
    const transcriptions = await transcriptionRepository.findAll();
    return NextResponse.json(transcriptions);
  } catch {
    return NextResponse.json({ error: "Failed to fetch transcriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const transcriptionRepository = await SupabaseTranscriptionRepository.create();
    
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required." }, { status: 400 });
    }

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      response_format: "json",
      language: "en",
    });

    const content = transcription.text;
    if (!content) {
      return NextResponse.json({ error: "Transcription failed, content is empty." }, { status: 500 });
    }

    const title = content.split(' ').slice(0, 5).join(' ') + '...';
    const newTranscription = await transcriptionRepository.create(title, content);

    if (!newTranscription) {
      return NextResponse.json({ error: "Failed to save transcription." }, { status: 500 });
    }

    return NextResponse.json(newTranscription, { status: 201 });

  } catch (error: unknown) {
    console.error("API Error:", error);
    let errorMessage = "Failed to create transcription.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}