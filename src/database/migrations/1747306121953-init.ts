import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1747306121953 implements MigrationInterface {
  name = 'Init1747306121953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."idx_otp_verification_phone_number"`,
    );
    await queryRunner.query(
      `CREATE TABLE "gc_cms_otp" ("id" SERIAL NOT NULL, "phone_number" character varying(20), "email" character varying, "otp" character varying(10) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "gc_cms_user_id" uuid, CONSTRAINT "PK_32474ce82e089fa567723267e35" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gc_cms_sessions" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "gc_cms_user_id" uuid, CONSTRAINT "PK_c378b59138793769a32e227c4a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_07facdb342ca2d1c09d25b29b3" ON "gc_cms_sessions" ("gc_cms_user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "gc_cms_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "module" character varying(100) NOT NULL, "action" character varying(50), "is_active" boolean NOT NULL DEFAULT true, "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2aefe321453cc6ff265b7e5d586" UNIQUE ("module", "action"), CONSTRAINT "PK_99fe31c8d472714d7fab77060e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gc_cms_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_641fd1df6c7faa300d0a930c791" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gc_cms_user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gc_cms_user_id" uuid NOT NULL, "role_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8f33d5c0dd897d04b356f1fc24a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gc_cms_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" text NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone_number" character varying(20), "last_login" TIMESTAMP, "status" character varying(50) NOT NULL DEFAULT 'Active', "profile_picture_id" uuid, "gc_cms_category_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0bfcfd82e7868e6e3fae9c47503" UNIQUE ("email"), CONSTRAINT "REL_fb2c504078a22d5efc520c9bad" UNIQUE ("profile_picture_id"), CONSTRAINT "PK_463731af6b3bf3e1c6954c8c75d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gc_cms_role_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d89fd97234b4d9543f06e4a6205" PRIMARY KEY ("role_id", "permission_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gc_cms_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gc_cms_user_id" uuid, "type" character varying, "title" jsonb NOT NULL, "message" jsonb NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_16ca3c3ba117ef2fd83e10240ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."gc_cms_notification_tokens_platform_enum" AS ENUM('IOS', 'ANDROID', 'WEB')`,
    );
    await queryRunner.query(
      `CREATE TABLE "gc_cms_notification_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gc_cms_user_id" uuid, "device_id" character varying NOT NULL, "device_token" text NOT NULL, "platform" "public"."gc_cms_notification_tokens_platform_enum" NOT NULL, "device_type" character varying(50) NOT NULL, "app_version" character varying(20) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "last_active_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_88ded50ad2e8aaa6f8832ddd5a3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_a59829dbc37fa806643bfd5c7e" ON "gc_cms_role_permissions" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_133cb8120091df6b2e0e9f2796" ON "gc_cms_role_permissions" ("permission_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_otp" ADD CONSTRAINT "FK_3dd314d6812e1843713f5bc4fc0" FOREIGN KEY ("gc_cms_user_id") REFERENCES "gc_cms_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_sessions" ADD CONSTRAINT "FK_07facdb342ca2d1c09d25b29b3a" FOREIGN KEY ("gc_cms_user_id") REFERENCES "gc_cms_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_user_roles" ADD CONSTRAINT "FK_96d5b6584cda79412f88f017ee7" FOREIGN KEY ("gc_cms_user_id") REFERENCES "gc_cms_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_user_roles" ADD CONSTRAINT "FK_d0319725a5b5e497f2cb4c65685" FOREIGN KEY ("role_id") REFERENCES "gc_cms_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_users" ADD CONSTRAINT "FK_fb2c504078a22d5efc520c9bade" FOREIGN KEY ("profile_picture_id") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_users" ADD CONSTRAINT "FK_0475347cb94679989197911addc" FOREIGN KEY ("gc_cms_category_id") REFERENCES "gc_cms_user_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" ADD CONSTRAINT "FK_a59829dbc37fa806643bfd5c7e4" FOREIGN KEY ("role_id") REFERENCES "gc_cms_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" ADD CONSTRAINT "FK_133cb8120091df6b2e0e9f27966" FOREIGN KEY ("permission_id") REFERENCES "gc_cms_permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_notifications" ADD CONSTRAINT "FK_fe28e76cbf38dd2e0b025621fc0" FOREIGN KEY ("gc_cms_user_id") REFERENCES "gc_cms_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_notification_tokens" ADD CONSTRAINT "FK_53734e8ec3704f5aa0607ddc470" FOREIGN KEY ("gc_cms_user_id") REFERENCES "gc_cms_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gc_cms_notification_tokens" DROP CONSTRAINT "FK_53734e8ec3704f5aa0607ddc470"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_notifications" DROP CONSTRAINT "FK_fe28e76cbf38dd2e0b025621fc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" DROP CONSTRAINT "FK_133cb8120091df6b2e0e9f27966"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" DROP CONSTRAINT "FK_a59829dbc37fa806643bfd5c7e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_users" DROP CONSTRAINT "FK_0475347cb94679989197911addc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_users" DROP CONSTRAINT "FK_fb2c504078a22d5efc520c9bade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_user_roles" DROP CONSTRAINT "FK_d0319725a5b5e497f2cb4c65685"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_user_roles" DROP CONSTRAINT "FK_96d5b6584cda79412f88f017ee7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_sessions" DROP CONSTRAINT "FK_07facdb342ca2d1c09d25b29b3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_otp" DROP CONSTRAINT "FK_3dd314d6812e1843713f5bc4fc0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_133cb8120091df6b2e0e9f2796"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a59829dbc37fa806643bfd5c7e"`,
    );

    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "gc_cms_role_permissions" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );

    await queryRunner.query(`DROP TABLE "gc_cms_notification_tokens"`);
    await queryRunner.query(
      `DROP TYPE "public"."gc_cms_notification_tokens_platform_enum"`,
    );
    await queryRunner.query(`DROP TABLE "gc_cms_notifications"`);
    await queryRunner.query(`DROP TABLE "gc_cms_role_permissions"`);
    await queryRunner.query(`DROP TABLE "gc_cms_users"`);
    await queryRunner.query(`DROP TABLE "gc_cms_user_roles"`);
    await queryRunner.query(`DROP TABLE "gc_cms_roles"`);
    await queryRunner.query(`DROP TABLE "gc_cms_permissions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_07facdb342ca2d1c09d25b29b3"`,
    );
    await queryRunner.query(`DROP TABLE "gc_cms_sessions"`);
    await queryRunner.query(`DROP INDEX "public"."idx_otp_verification_email"`);
    await queryRunner.query(`DROP TABLE "gc_cms_otp"`);
    await queryRunner.query(
      `CREATE INDEX "idx_otp_verification_phone_number" ON "otp" ("phone_number") `,
    );
  }
}
