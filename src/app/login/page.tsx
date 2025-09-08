// src/app/login/page.tsx
'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Welcome
        </h1>
        <p className="text-center text-slate-400 mb-8">
          Sign in or create an account to continue
        </p>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={[]}
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/`}
        />
      </div>
    </div>
  );
}