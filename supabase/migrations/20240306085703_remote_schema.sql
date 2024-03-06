alter table "public"."media" alter column "url" drop not null;

create policy "Enable read access for all users"
on "public"."feedMedia"
as permissive
for select
to public
using (true);



