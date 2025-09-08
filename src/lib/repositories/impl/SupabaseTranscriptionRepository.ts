// src/lib/repositories/impl/SupabaseTranscriptionRepository.ts
import { ITranscriptionRepository } from "../ITranscriptionRepository";
import { Transcription } from "@/types/transcription";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseTranscriptionRepository implements ITranscriptionRepository {
  private supabase: SupabaseClient;


  private constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  public static async create(): Promise<SupabaseTranscriptionRepository> {
    const supabaseClient = await createSupabaseServerClient();
    return new SupabaseTranscriptionRepository(supabaseClient);
  }

  async create(title: string, content: string): Promise<Transcription | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('transcriptions')
      .insert({ title, content, user_id: user.id })
      .select()
      .single();

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
      return [];
    }
    return data as Transcription[];
  }
}