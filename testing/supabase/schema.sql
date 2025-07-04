

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


CREATE EXTENSION IF NOT EXISTS "pgsodium";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."create_group"("groupname" "text", "admin" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$ 
with createdgr as (INSERT INTO "Group" (name,admin) VALUES (create_group.groupName, create_group.admin) returning *)
INSERT INTO "GroupUser" (group_id,user_id) SELECT id,create_group.admin FROM createdgr 
$$;


ALTER FUNCTION "public"."create_group"("groupname" "text", "admin" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Group" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "theme" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "admin" "uuid"
);


ALTER TABLE "public"."Group" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_groups"("user_id" "uuid") RETURNS SETOF "public"."Group"
    LANGUAGE "sql"
    AS $$
SELECT "Group".* FROM "GroupUser" LEFT JOIN "Group" ON ("GroupUser".group_id = "Group".id and "GroupUser".user_id = get_groups.user_id) WHERE "Group".admin = get_groups.user_id
$$;


ALTER FUNCTION "public"."get_groups"("user_id" "uuid") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."User" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" DEFAULT ''::"text"
);


ALTER TABLE "public"."User" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."query_friend"() RETURNS "public"."User"
    LANGUAGE "sql"
    AS $$
    select * from "User";  
$$;


ALTER FUNCTION "public"."query_friend"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."query_friend"("email" "text") RETURNS SETOF "public"."User"
    LANGUAGE "sql"
    AS $$
    SELECT U2.* FROM "User"
    left join "Friend" 
    ON "User".id = "Friend".user1_id
    left join "User" U2 on U2.id = "Friend".user2_id
    where "User".email = query_friend.email and U2 is not null
    union 
    SELECT U2.* FROM "User"
    left join  "Friend"
    on "User".id = "Friend".user2_id
    left join "User" U2 on U2.id = "Friend".user1_id
    where "User".email = query_friend.email and U2 is not null
$$;


ALTER FUNCTION "public"."query_friend"("email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."query_friend2"() RETURNS "public"."User"
    LANGUAGE "sql"
    AS $$
    select * from "User";  
$$;


ALTER FUNCTION "public"."query_friend2"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."query_id"("email" "text") RETURNS "uuid"
    LANGUAGE "sql"
    AS $$ 
    select "User".id from "User" where "User".email = query_id.email
$$;


ALTER FUNCTION "public"."query_id"("email" "text") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."OneOneRoom" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user1_id" "uuid" NOT NULL,
    "user2_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "theme" "text"
);


ALTER TABLE "public"."OneOneRoom" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."query_one_one_room"("u1" "uuid", "u2" "uuid") RETURNS SETOF "public"."OneOneRoom"
    LANGUAGE "sql"
    AS $$
  SELECT r.* FROM "OneOneRoom" r
  WHERE (r.user1_id = u1 and r.user2_id = u2 )or (r.user1_id = u2 and r.user2_id = u1)
$$;


ALTER FUNCTION "public"."query_one_one_room"("u1" "uuid", "u2" "uuid") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Friend" (
    "user1_id" "uuid" NOT NULL,
    "user2_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."Friend" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."FriendRequest" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "to" "uuid" NOT NULL,
    "from" "uuid" NOT NULL
);


ALTER TABLE "public"."FriendRequest" OWNER TO "postgres";


ALTER TABLE "public"."FriendRequest" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."FriendRequest_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."GroupUser" (
    "user_id" "uuid",
    "group_id" "uuid",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."GroupUser" OWNER TO "postgres";


ALTER TABLE ONLY "public"."FriendRequest"
    ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Friend"
    ADD CONSTRAINT "Friend_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."GroupUser"
    ADD CONSTRAINT "GroupUser_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."GroupUser"
    ADD CONSTRAINT "GroupUser_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Group"
    ADD CONSTRAINT "Group_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."OneOneRoom"
    ADD CONSTRAINT "OneOneRoom_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."OneOneRoom"
    ADD CONSTRAINT "OneOneRoom_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."FriendRequest"
    ADD CONSTRAINT "FriendRequest_from_fkey" FOREIGN KEY ("from") REFERENCES "public"."User"("id");



ALTER TABLE ONLY "public"."FriendRequest"
    ADD CONSTRAINT "FriendRequest_to_fkey" FOREIGN KEY ("to") REFERENCES "public"."User"("id");



ALTER TABLE ONLY "public"."Friend"
    ADD CONSTRAINT "Friend_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "public"."User"("id");



ALTER TABLE ONLY "public"."Friend"
    ADD CONSTRAINT "Friend_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "public"."User"("id");



ALTER TABLE ONLY "public"."GroupUser"
    ADD CONSTRAINT "GroupUser_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."Group"("id");



ALTER TABLE ONLY "public"."GroupUser"
    ADD CONSTRAINT "GroupUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id");



ALTER TABLE ONLY "public"."Group"
    ADD CONSTRAINT "Group_admin_fkey" FOREIGN KEY ("admin") REFERENCES "public"."User"("id");



ALTER TABLE ONLY "public"."OneOneRoom"
    ADD CONSTRAINT "OneOneRoom_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "public"."User"("id");



ALTER TABLE ONLY "public"."OneOneRoom"
    ADD CONSTRAINT "OneOneRoom_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "public"."User"("id");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





























































































































































































GRANT ALL ON FUNCTION "public"."create_group"("groupname" "text", "admin" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_group"("groupname" "text", "admin" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_group"("groupname" "text", "admin" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."Group" TO "anon";
GRANT ALL ON TABLE "public"."Group" TO "authenticated";
GRANT ALL ON TABLE "public"."Group" TO "service_role";
GRANT ALL ON TABLE "public"."Group" TO "supabase_admin";



GRANT ALL ON FUNCTION "public"."get_groups"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_groups"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_groups"("user_id" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."User" TO "anon";
GRANT ALL ON TABLE "public"."User" TO "authenticated";
GRANT ALL ON TABLE "public"."User" TO "service_role";
GRANT ALL ON TABLE "public"."User" TO "supabase_admin";



GRANT ALL ON FUNCTION "public"."query_friend"() TO "anon";
GRANT ALL ON FUNCTION "public"."query_friend"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."query_friend"() TO "service_role";



GRANT ALL ON FUNCTION "public"."query_friend"("email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."query_friend"("email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."query_friend"("email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."query_friend2"() TO "anon";
GRANT ALL ON FUNCTION "public"."query_friend2"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."query_friend2"() TO "service_role";



GRANT ALL ON FUNCTION "public"."query_id"("email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."query_id"("email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."query_id"("email" "text") TO "service_role";



GRANT ALL ON TABLE "public"."OneOneRoom" TO "anon";
GRANT ALL ON TABLE "public"."OneOneRoom" TO "authenticated";
GRANT ALL ON TABLE "public"."OneOneRoom" TO "service_role";
GRANT ALL ON TABLE "public"."OneOneRoom" TO "supabase_admin";



GRANT ALL ON FUNCTION "public"."query_one_one_room"("u1" "uuid", "u2" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."query_one_one_room"("u1" "uuid", "u2" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."query_one_one_room"("u1" "uuid", "u2" "uuid") TO "service_role";






























GRANT ALL ON TABLE "public"."Friend" TO "anon";
GRANT ALL ON TABLE "public"."Friend" TO "authenticated";
GRANT ALL ON TABLE "public"."Friend" TO "service_role";
GRANT ALL ON TABLE "public"."Friend" TO "supabase_admin";



GRANT ALL ON TABLE "public"."FriendRequest" TO "anon";
GRANT ALL ON TABLE "public"."FriendRequest" TO "authenticated";
GRANT ALL ON TABLE "public"."FriendRequest" TO "service_role";
GRANT ALL ON TABLE "public"."FriendRequest" TO "supabase_admin";



GRANT ALL ON SEQUENCE "public"."FriendRequest_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."FriendRequest_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."FriendRequest_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."GroupUser" TO "anon";
GRANT ALL ON TABLE "public"."GroupUser" TO "authenticated";
GRANT ALL ON TABLE "public"."GroupUser" TO "service_role";
GRANT ALL ON TABLE "public"."GroupUser" TO "supabase_admin";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
