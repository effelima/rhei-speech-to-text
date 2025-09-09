// src/app/speech2text/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Transcription } from '@/types/transcription';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

// Ícones (sem alterações)
const RecordingIcon = () => ( <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" /></svg> );
const DocumentIcon = () => ( <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> );

export default function Speech2TextPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // *** INÍCIO DA MUDANÇA CRÍTICA ***
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        // Força uma atualização da página para re-executar o middleware e o código do servidor
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);
  // *** FIM DA MUDANÇA CRÍTICA ***

  const fetchTranscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/transcriptions');
      if (!response.ok) throw new Error('Failed to fetch transcriptions.');
      const data: Transcription[] = await response.json();
      setTranscriptions(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        fetchTranscriptions();
      }
    };
    checkSessionAndFetch();
  }, [router, supabase, fetchTranscriptions]);
  
  // ... (O resto do seu código, como startRecording e stopRecording, permanece igual)
  const startRecording = async () => {
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          setIsLoading(true);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          try {
            const response = await fetch('/api/transcriptions', {
              method: 'POST',
              body: formData,
            });
            if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.error || 'Failed to transcribe the audio.');
            }
            const newTranscription: Transcription = await response.json();
            setTranscriptions(prev => [newTranscription, ...prev]);
          } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError('An unknown error occurred during transcription.');
          } finally {
            setIsLoading(false);
          }
        };
        mediaRecorder.start();
        setIsRecording(true);
      } catch {
        setError('Permission to use the microphone was denied.');
      }
    } else {
      setError('Audio recording is not supported by this browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  if (isLoading && transcriptions.length === 0) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-[#0B0F19]">
            <p className="text-white">Loading...</p>
        </div>
    )
  }

  return (
    <main className="bg-[#0B0F19] text-slate-200 min-h-screen font-sans">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white tracking-tight">Transcription Tool</h1>
          <p className="text-xl text-slate-400 mt-2 max-w-2xl mx-auto">An internal tool to boost the RHEI team&apos;s productivity.</p>
        </header>
        <section className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl shadow-xl mb-12 flex flex-col items-center backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-6">Click the button below to start recording.</p>
          <button onClick={isRecording ? stopRecording : startRecording} disabled={isLoading} className={`px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 ease-in-out flex items-center justify-center gap-3 w-64 h-16 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-[#0B0F19] disabled:opacity-50 disabled:cursor-not-allowed ${isRecording ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 focus:ring-yellow-500' : 'bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-600'}`}>
            {isLoading ? (<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>) : isRecording ? (<> <RecordingIcon /> <span>Recording...</span> </>) : (<span>Start Recording</span>)}
          </button>
          {error && <p className="mt-4 text-sm text-yellow-400">{error}</p>}
        </section>
        <section>
          <div className="space-y-4">
            {transcriptions.map((t) => (
              <article key={t.id} className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl shadow-lg transition-all hover:border-slate-600">
                <div className="flex items-center mb-2">
                  <DocumentIcon />
                  <h3 className="text-lg font-semibold text-white">{t.title}</h3>
                </div>
                <p className="text-slate-300 leading-relaxed ml-8">{t.content}</p>
                <p className="text-xs text-slate-500 mt-3 text-right">{new Date(t.created_at).toLocaleString('en-US')}</p>
              </article>
            ))}
            {isLoading && transcriptions.length === 0 && (<p className="text-center text-slate-400 py-8">Loading transcriptions...</p>)}
            {!isLoading && transcriptions.length === 0 && (
              <div className="text-center py-16 px-4 border-2 border-dashed border-slate-700 rounded-2xl">
                <h3 className="text-xl font-medium text-white">No Transcriptions Yet</h3>
                <p className="text-slate-500 mt-2">Your recordings will appear here once they&apos;re completed.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}