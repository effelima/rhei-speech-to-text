drop policy "Public access for MVP" on public.transcriptions;

create policy "Users can view their own transcriptions"
on public.transcriptions for select
using (auth.uid() = user_id);

create policy "Users can create transcriptions"
on public.transcriptions for insert
with check (auth.uid() = user_id);