// src/app/api/transcriptions/route.ts
import { SupabaseTranscriptionRepository } from "@/lib/repositories/impl/SupabaseTranscriptionRepository";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// NÃO instanciamos o repositório aqui fora

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Handler para obter todas as transcrições
export async function GET() {
  try {
    // Instanciamos o repositório AQUI, dentro da função GET
    const transcriptionRepository = new SupabaseTranscriptionRepository();
    const transcriptions = await transcriptionRepository.findAll();
    return NextResponse.json(transcriptions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transcriptions" }, { status: 500 });
  }
}

// Handler para criar uma nova transcrição a partir de um áudio
export async function POST(request: Request) {
  try {
    // Instanciamos o repositório AQUI, dentro da função POST
    const transcriptionRepository = new SupabaseTranscriptionRepository();
    
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file is required." }, { status: 400 });
    }

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      response_format: "json",
      language: "en", // Changed to English as per your request
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

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create transcription." }, { status: 500 });
  }
}