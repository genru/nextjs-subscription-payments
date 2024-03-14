drop policy "Can read access by owner only" on "public"."feeds";

alter table "public"."feeds" add column "status" integer not null default 0;

create policy "Can read public"
on "public"."feeds"
as permissive
for select
to public
using (true);



