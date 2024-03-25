alter table "public"."feeds" add column "channel_info" jsonb;

alter table "public"."users" drop column "yt_channel";


