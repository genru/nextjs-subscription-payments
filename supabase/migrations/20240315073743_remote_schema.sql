alter table "public"."feedMedia" add column "position" integer default 0;

alter table "public"."feedMedia" add constraint "feedMedia_position_check" CHECK (("position" >= 0)) not valid;

alter table "public"."feedMedia" validate constraint "feedMedia_position_check";


