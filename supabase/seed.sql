SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.5 (Ubuntu 15.5-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '52490d98-6cf3-4403-8cae-4bcc4e8bef34', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"test@mail.com","user_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","user_phone":""}}', '2024-02-23 14:21:29.786366+00', ''),
	('00000000-0000-0000-0000-000000000000', '8cf6ba34-560f-4d8d-89ab-4c7b33aa9c11', '{"action":"login","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-02-23 15:28:55.62464+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a932524-d543-491e-84f0-0d0f191d5741', '{"action":"logout","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"account"}', '2024-02-23 15:33:08.52737+00', ''),
	('00000000-0000-0000-0000-000000000000', '638054cb-6c8f-4a48-b205-afd42aedec4c', '{"action":"user_confirmation_requested","actor_id":"3ce5df44-4b32-4f6d-9b5f-50ffc1b33ee9","actor_username":"genjuroa@ymail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-02-23 15:34:50.076898+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c647235d-3a79-484f-aa60-38c3c3ec2f9c', '{"action":"user_signedup","actor_id":"3ce5df44-4b32-4f6d-9b5f-50ffc1b33ee9","actor_username":"genjuroa@ymail.com","actor_via_sso":false,"log_type":"team"}', '2024-02-23 15:35:24.146264+00', ''),
	('00000000-0000-0000-0000-000000000000', '475d6c26-926c-44c5-a815-ba241bac364e', '{"action":"login","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-02-23 16:55:19.978973+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a2a8e0e3-4439-46e3-83c6-d83e9a7c9098', '{"action":"login","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-02-23 17:01:06.677459+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f21e431c-d989-44ed-b5db-5e24c019b130', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-24 06:36:23.240907+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b1d4b06-7cf0-43b6-9c24-c243963dfeb8', '{"action":"token_revoked","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-24 06:36:23.24197+00', ''),
	('00000000-0000-0000-0000-000000000000', '00ae8729-27d7-4b54-92c7-f62c56fa2ef5', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-24 08:23:26.549799+00', ''),
	('00000000-0000-0000-0000-000000000000', '98452202-a4f0-48c6-85b3-458bb9fb7ef6', '{"action":"token_revoked","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-24 08:23:26.550364+00', ''),
	('00000000-0000-0000-0000-000000000000', '43c4b12e-2a99-4d72-a4d7-cc1478328e64', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-24 08:23:28.118975+00', ''),
	('00000000-0000-0000-0000-000000000000', '31e31de4-731d-4e66-a097-b442caf89bd5', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-24 08:23:28.142297+00', ''),
	('00000000-0000-0000-0000-000000000000', '62a0217f-bbd7-47b9-aba8-5c1c3f9a0577', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-24 08:23:28.665225+00', ''),
	('00000000-0000-0000-0000-000000000000', 'adc70e77-0179-46dd-a26e-22d358582283', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-24 08:23:29.197005+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b5557d00-42fc-4578-b380-86e38a7571b4', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-24 08:23:30.122864+00', ''),
	('00000000-0000-0000-0000-000000000000', '00a573e3-2d6b-4465-96d7-70699862cfd9', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-24 08:23:30.147+00', ''),
	('00000000-0000-0000-0000-000000000000', '3b90a2ab-eee3-4c5f-ba63-90764fa503cd', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 12:38:21.716216+00', ''),
	('00000000-0000-0000-0000-000000000000', '43d9e0fb-4d03-474a-a095-89ca0c949b40', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 12:38:22.054477+00', ''),
	('00000000-0000-0000-0000-000000000000', '08156d65-b4a8-4bc9-82a3-a7e4f89d98c3', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 12:38:22.093285+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee9f7e5d-41ed-456e-95b7-f790fe961bf7', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 12:38:22.538248+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f557d493-4b1d-494a-9fd4-843ba15ae163', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 12:38:23.031164+00', ''),
	('00000000-0000-0000-0000-000000000000', '50e2f9a6-0e6f-448e-8792-471b820edff4', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 12:38:23.993003+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc4c6027-5d09-4b57-9f5b-623df0c63b0d', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 12:38:24.045996+00', ''),
	('00000000-0000-0000-0000-000000000000', '0185d046-4b40-4a2d-a954-2d964fc8f2a8', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:18:42.589098+00', ''),
	('00000000-0000-0000-0000-000000000000', '71a721f7-166d-42f5-9cbe-797bedadfe3e', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:18:43.997413+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f8fa729b-4fdd-4c7d-b8b5-7419b67ab29c', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:18:45.116673+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cfa260f8-3dbf-410c-8f7d-1e28a8a2472f', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:18:45.46136+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8730145-1866-44e3-97dd-5ef7f405c723', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:18:45.482173+00', ''),
	('00000000-0000-0000-0000-000000000000', '181212db-1c9e-40c0-bf61-8cd6ba8e1bff', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:18:48.161277+00', ''),
	('00000000-0000-0000-0000-000000000000', 'af186d6b-dbac-4c19-addf-4c07c9bd3d4e', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:18:49.137533+00', ''),
	('00000000-0000-0000-0000-000000000000', '44c417e6-ef44-4ea3-b463-cbfea83dc04f', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:18:49.633586+00', ''),
	('00000000-0000-0000-0000-000000000000', '0d6bc006-b959-4389-a143-2fd089cc652b', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:18:50.158235+00', ''),
	('00000000-0000-0000-0000-000000000000', '520c1cb9-e8ea-4830-b894-675d7f9083e7', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:01.362823+00', ''),
	('00000000-0000-0000-0000-000000000000', '7883ec72-60eb-4876-8581-d40ae3ec5673', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:08.634288+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f17e3376-68bf-4cfa-b643-08f0453d36a9', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:14.626321+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e1e0c77-20d8-4751-b7c0-fbdab5fa8e56', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:15.986658+00', ''),
	('00000000-0000-0000-0000-000000000000', '556c6ba8-c894-4025-beb0-e164f785f9ff', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:27.215264+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e011889-175e-40e9-a5e2-688ae47aba7d', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:28.178181+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c28598f7-c1a0-4819-8670-c91b3a7d83e0', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:28.187837+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a8c3bc63-04e9-49d0-98b5-79857bc72424', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:28.673973+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d56f080-c30e-47e1-8ce2-655020b0798d', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:29.181147+00', ''),
	('00000000-0000-0000-0000-000000000000', '5504bb56-302b-4dd5-b916-cbcae15fc89a', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:30.037273+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd1574693-9aa6-4430-8a73-c5429982b61e', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:30.390824+00', ''),
	('00000000-0000-0000-0000-000000000000', '42b2ef8a-5b5a-4a80-b893-064f19d04fd8', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:30.400203+00', ''),
	('00000000-0000-0000-0000-000000000000', '14478a79-b14e-4a9c-a9b0-b0ceeefc3917', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:35.160967+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ccc4342-a2db-4c8f-9731-e1ae80fd3e9b', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:35.866099+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3c85d37-0e47-4c26-adff-b32429482555', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 13:19:35.888313+00', ''),
	('00000000-0000-0000-0000-000000000000', '0cb350e2-3661-461a-b03c-7592b6ac29d1', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 14:02:51.611135+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fb12e043-abd0-435e-aeeb-6e52a88e5c4c', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 14:02:52.678852+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb22dfbb-9554-4fdf-9ed7-248b879a6323', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 14:02:53.93834+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf57a8e0-c9ad-4255-b162-d031bb153be4', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 14:02:54.278618+00', ''),
	('00000000-0000-0000-0000-000000000000', '62f24748-a6aa-4592-8000-c2e7cd30849e', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 14:02:54.28692+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7690dc9-2dd8-4ee5-b8e3-10f7efd4921b', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 14:03:07.206182+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1621a10-6b6d-49ac-80e0-286cc9805bee', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 14:03:07.532873+00', ''),
	('00000000-0000-0000-0000-000000000000', '28ff9c23-c738-40df-ac32-64a6439531c4', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 14:03:08.215974+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9f67368-3895-4fa6-b458-e7430afd5513', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 14:12:07.314842+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8ba8129-ae51-4307-9344-73eef22208bf', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-25 14:12:07.579935+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba4381c0-fcab-4629-87f9-0ccf5ec0933a', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-26 05:37:30.409364+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f8c4abf-fdaf-4bd7-a9cf-94de28b99f3c', '{"action":"token_refreshed","actor_id":"15f5f795-ffae-4d7f-9d7a-e99d1063b8d3","actor_username":"test@mail.com","actor_via_sso":false,"log_type":"token"}', '2024-02-26 08:00:42.410686+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method") VALUES
	('7f0021d6-251e-4666-a334-27110a896e29', '3ce5df44-4b32-4f6d-9b5f-50ffc1b33ee9', '6301cf23-6292-4a3a-b08f-8d2391b8d9b0', 's256', 'PjVJpP47PLiTUKkizxK-vjxLpo6-cgMR5_iJCvZdtSE', 'email', '', '', '2024-02-23 15:34:50.077422+00', '2024-02-23 15:34:50.077422+00', 'email/signup');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at") VALUES
	('00000000-0000-0000-0000-000000000000', '3ce5df44-4b32-4f6d-9b5f-50ffc1b33ee9', 'authenticated', 'authenticated', 'genjuroa@ymail.com', '$2a$10$aC.b4MwMmymZh.Bh0xoCo.MazsD6KmE.Byo9CXoqaVZNt07dZrpqq', '2024-02-23 15:35:24.14688+00', NULL, '', '2024-02-23 15:34:50.078444+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-02-23 15:34:50.071245+00', '2024-02-23 15:35:24.147119+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', '15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', 'authenticated', 'authenticated', 'test@mail.com', '$2a$10$Rw8S6/QDsqJh8jv2t4eB4uxzpNFllspCdv.tWAuVI.6zmzCJIjFcS', '2024-02-23 14:21:29.788023+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-02-23 17:01:06.678098+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-02-23 14:21:29.780714+00', '2024-02-24 08:23:26.55202+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', '15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', '{"sub": "15f5f795-ffae-4d7f-9d7a-e99d1063b8d3", "email": "test@mail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-02-23 14:21:29.785314+00', '2024-02-23 14:21:29.78538+00', '2024-02-23 14:21:29.78538+00', '534c726f-39d3-4835-9caf-c19d16e5a757'),
	('3ce5df44-4b32-4f6d-9b5f-50ffc1b33ee9', '3ce5df44-4b32-4f6d-9b5f-50ffc1b33ee9', '{"sub": "3ce5df44-4b32-4f6d-9b5f-50ffc1b33ee9", "email": "genjuroa@ymail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-02-23 15:34:50.076042+00', '2024-02-23 15:34:50.076093+00', '2024-02-23 15:34:50.076093+00', 'ff2f48ea-f357-492f-be97-7a8fa3aaba8b');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('4a7c64c6-1615-44b8-89d4-0ec1ce80ddca', '15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', '2024-02-23 16:55:19.979662+00', '2024-02-26 08:00:42.411744+00', NULL, 'aal1', NULL, '2024-02-26 08:00:42.41167', 'Vercel Edge Functions', '2a06:98c0:3600::103', NULL),
	('dc846d83-ac1c-494a-81f5-95802f9f9f2a', '15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', '2024-02-23 17:01:06.67817+00', '2024-02-24 06:36:23.250415+00', NULL, 'aal1', NULL, '2024-02-24 06:36:23.250342', 'Vercel Edge Functions', '2a06:98c0:3600::103', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('4a7c64c6-1615-44b8-89d4-0ec1ce80ddca', '2024-02-23 16:55:19.981681+00', '2024-02-23 16:55:19.981681+00', 'password', '20bc56fc-37ca-4379-a206-87253d031163'),
	('dc846d83-ac1c-494a-81f5-95802f9f9f2a', '2024-02-23 17:01:06.680136+00', '2024-02-23 17:01:06.680136+00', 'password', 'fb36673b-a056-419b-bc00-0c6df464c41e');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 3, 'U7W2IlQOBPFRTyqr0kkAgg', '15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', true, '2024-02-23 17:01:06.678885+00', '2024-02-24 06:36:23.245494+00', NULL, 'dc846d83-ac1c-494a-81f5-95802f9f9f2a'),
	('00000000-0000-0000-0000-000000000000', 4, 'oYHJiHhCvPfHiRtE2f2XiA', '15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', false, '2024-02-24 06:36:23.247917+00', '2024-02-24 06:36:23.247917+00', 'U7W2IlQOBPFRTyqr0kkAgg', 'dc846d83-ac1c-494a-81f5-95802f9f9f2a'),
	('00000000-0000-0000-0000-000000000000', 2, 'lbfVpEpx0xHcnsm8cwTG4A', '15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', true, '2024-02-23 16:55:19.980446+00', '2024-02-24 08:23:26.55085+00', NULL, '4a7c64c6-1615-44b8-89d4-0ec1ce80ddca'),
	('00000000-0000-0000-0000-000000000000', 5, '0NIO2wudcq0GsStK5dd1gA', '15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', false, '2024-02-24 08:23:26.551155+00', '2024-02-24 08:23:26.551155+00', 'lbfVpEpx0xHcnsm8cwTG4A', '4a7c64c6-1615-44b8-89d4-0ec1ce80ddca');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customers" ("id", "stripe_customer_id") VALUES
	('15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', 'cus_PcGZzERWYroMxD');


--
-- Data for Name: feeds; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "active", "name", "description", "image", "metadata") VALUES
	('prod_Pc5l9ZAVgQuwz9', true, 'Freelancer', 'Freelancer', NULL, '{"index": "10"}'),
	('prod_Pc5m7c6aVN1vUY', true, 'Hobby', '1000 credit per month', NULL, '{"index": "20"}');


--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."prices" ("id", "product_id", "active", "description", "unit_amount", "currency", "type", "interval", "interval_count", "trial_period_days", "metadata") VALUES
	('price_1On1k0BXxyWukzdOieodmqq9', 'prod_Pc5m7c6aVN1vUY', true, NULL, 18000, 'usd', 'recurring', 'year', 1, 0, NULL),
	('price_1On1p7BXxyWukzdOi0Bo8foi', 'prod_Pc5l9ZAVgQuwz9', true, NULL, 8000, 'usd', 'recurring', 'year', 1, 0, NULL),
	('price_1On1vsBXxyWukzdOe6szYF0v', 'prod_Pc5m7c6aVN1vUY', true, NULL, 4900, 'usd', 'recurring', 'month', 3, 0, NULL),
	('price_1Omra0BXxyWukzdOdxhiZz7q', 'prod_Pc5l9ZAVgQuwz9', true, NULL, 980, 'usd', 'recurring', 'month', 1, 0, NULL);


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."subscriptions" ("id", "user_id", "status", "metadata", "price_id", "quantity", "cancel_at_period_end", "created", "current_period_start", "current_period_end", "ended_at", "cancel_at", "canceled_at", "trial_start", "trial_end") VALUES
	('sub_1On26MBXxyWukzdOF958VTE1', '15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', 'active', '{}', 'price_1Omra0BXxyWukzdOdxhiZz7q', 1, false, '2024-02-23 16:59:58+00', '2024-02-23 16:59:58+00', '2024-03-23 16:59:58+00', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "full_name", "avatar_url", "billing_address", "payment_method") VALUES
	('15f5f795-ffae-4d7f-9d7a-e99d1063b8d3', 'genjuro', 'https://i2.100024.xyz/2024/02/23/12jjswf.webp
', NULL, NULL),
	('3ce5df44-4b32-4f6d-9b5f-50ffc1b33ee9', NULL, NULL, NULL, NULL);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 5, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: feeds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."feeds_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
