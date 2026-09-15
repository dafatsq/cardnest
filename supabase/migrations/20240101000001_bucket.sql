-- Create the flashcard-images storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('flashcard-images', 'flashcard-images', true, 10485760, ARRAY['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do nothing;

-- Storage policy: users can upload objects to their own folder
create policy "Users can upload their own images" on storage.objects
  for insert
  with check (bucket_id = 'flashcard-images' AND auth.uid()::text = (storage.foldername(name))[0]);

-- Storage policy: users can view their own images
create policy "Users can view their own images" on storage.objects
  for select
  using (bucket_id = 'flashcard-images' AND auth.uid()::text = (storage.foldername(name))[0]);

-- Storage policy: users can delete their own images
create policy "Users can delete their own images" on storage.objects
  for delete
  using (bucket_id = 'flashcard-images' AND auth.uid()::text = (storage.foldername(name))[0]);

-- Storage policy: public read access for images (needed for img tags)
create policy "Public access for flashcard images" on storage.objects
  for select
  using (bucket_id = 'flashcard-images');
