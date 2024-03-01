alter table "public"."feeds" add column "author" text;

alter table "public"."feeds" add column "cover" text;

alter table "public"."feeds" add column "description" text;

alter table "public"."feeds" add column "source" text;

alter table "public"."feeds" add column "title" text;

alter table "public"."feeds" add column "uuid" uuid default gen_random_uuid();


