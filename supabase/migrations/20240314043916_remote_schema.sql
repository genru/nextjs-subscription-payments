create policy "Enable delete for everyone"
on "public"."feedMedia"
as permissive
for delete
to public
using (true);


create policy "Enable delete for users based on user_id"
on "public"."feeds"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Enable delete for everyone"
on "public"."media"
as permissive
for delete
to public
using (true);



