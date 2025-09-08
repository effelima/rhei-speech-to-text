// lib/repositories/ITranscriptionRepository.ts
import { Transcription } from "@/types/transcription";

export interface ITranscriptionRepository {
  create(title: string, content: string): Promise<Transcription | null>;
  findAll(): Promise<Transcription[]>;
  // Podemos adicionar mais métodos no futuro, como:
  // findById(id: number): Promise<Transcription | null>;
  // delete(id: number): Promise<boolean>;
}