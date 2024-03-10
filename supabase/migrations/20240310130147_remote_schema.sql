alter table "public"."media" add column "cover" text;

alter table "public"."media" add column "duration_in_sec" bigint not null;

alter table "public"."media" add column "guid" text not null;

CREATE UNIQUE INDEX media_guid_key ON public.media USING btree (guid);

alter table "public"."media" add constraint "media_guid_key" UNIQUE using index "media_guid_key";


