alter table public.transcriptions
add column user_id uuid references auth.users (id) on delete cascade;