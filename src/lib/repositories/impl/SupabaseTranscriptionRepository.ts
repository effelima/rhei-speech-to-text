// lib/repositories/impl/SupabaseTranscriptionRepository.ts
import { ITranscriptionRepository } from "../ITranscriptionRepository";
import { Transcription } from "@/types/transcription";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export class SupabaseTranscriptionRepository implements ITranscriptionRepository {
  private supabase;

  constructor() {
    // Inicializamos o cliente Supabase aqui
    this.supabase = createSupabaseServerClient();
  }

  async create(title: string, content: string): Promise<Transcription | null> {
    const { data, error } = await this.supabase
      .from('transcriptions')
      .insert({ title, content })
      .select()
      .single(); // .single() retorna um objeto em vez de um array

    if (error) {
      console.error("Error creating transcription:", error);
      return null;
    }
    return data as Transcription;
  }

  async findAll(): Promise<Transcription[]> {
    const { data, error } = await this.supabase
      .from('transcriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching transcriptions:", error);
      return []; // Retorna um array vazio em caso de erro
    }
    return data as Transcription[];
  }
}