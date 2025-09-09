// src/app/login/page.tsx
'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function LoginPage() {
  const supabase = createSupabaseBrowserClient();

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ??
      process?.env?.NEXT_PUBLIC_VERCEL_URL ??
      'http://localhost:3000/';
    url = url.includes('http') ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    url = `${url}auth/callback`;
    return url;
  };

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
          redirectTo={getURL()}
          localization={{
            variables: {
              forgotten_password: {
                link_text: '',
              },
            },
          }}
        />
      </div>
    </div>
  );
}