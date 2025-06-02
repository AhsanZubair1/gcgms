import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { UserCategory } from '@src/categories/enum/user-category.enum';
import { AppDataSource } from '@src/database/data-source';

dotenv.config();

export async function seedGCCMS(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Seed rejection reasons
    const rejectionReasons = [
      {
        category: UserCategory.MILITARY,
        values: [
          {
            en: 'Military ID: Expired, Mismatched, Blurry',
            ms: 'ID Tentera: Tamat Tempoh, Tidak Padan, Kabur',
          },
          {
            en: 'Facial Biometric: Not matching',
            ms: 'Biometrik Muka: Tidak sepadan',
          },
          {
            en: 'Armed Force Branch: Incorrect',
            ms: 'Cawangan Angkatan Tentera: Tidak betul',
          },
          {
            en: 'User Type: User type incorrect',
            ms: 'Jenis Pengguna: Jenis pengguna salah',
          },
        ],
      },
      {
        category: UserCategory.MINDEF_EMPLOY,
        values: [
          {
            en: 'MyKAD: Expired/Mismatched',
            ms: 'MyKad: Tamat Tempoh/Tidak Padan',
          },
          {
            en: 'User Type: User type incorrect',
            ms: 'Jenis Pengguna: Jenis pengguna salah',
          },
          {
            en: 'Facial Biometric: Not matching',
            ms: 'Biometrik Muka: Tidak sepadan',
          },
        ],
      },
      {
        category: UserCategory.VETERANS,
        values: [
          {
            en: 'MyKAD: Expired/Mismatched',
            ms: 'MyKad: Tamat Tempoh/Tidak Padan',
          },
          {
            en: 'User Type: User type incorrect',
            ms: 'Jenis Pengguna: Jenis pengguna salah',
          },
          {
            en: 'Facial Biometric: Not matching',
            ms: 'Biometrik Muka: Tidak sepadan',
          },
        ],
      },
    ];

    let rejectionSortOrder = 1;
    for (const item of rejectionReasons) {
      const categoryResult = await queryRunner.query(
        `SELECT id FROM "categories" WHERE value->>'en' = $1 LIMIT 1`,
        [item.category],
      );
      const categoryId = categoryResult?.[0]?.id;
      if (!categoryId) {
        throw new Error(`Category "${item.category}" not found.`);
      }

      for (const reason of item.values) {
        // Check if reason already exists
        const existingReason = await queryRunner.query(
          `SELECT id FROM "user_status_reasons" 
           WHERE user_category = $1 AND value->>'en' = $2 AND type = 'REJECT'`,
          [categoryId, reason.en],
        );

        if (!existingReason.length) {
          await queryRunner.query(
            `INSERT INTO "user_status_reasons" (
              user_category,
              value,
              description,
              type,
              is_active,
              sort_order
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              categoryId,
              JSON.stringify(reason),
              null,
              'REJECT',
              true,
              rejectionSortOrder++,
            ],
          );
        } else {
          rejectionSortOrder++; // Keep sort order consistent even if skipping
        }
      }
    }

    // Seed resubmission reasons
    const resubmissionReasons = [
      {
        category: UserCategory.MILITARY,
        values: [
          {
            en: 'Full Name',
            ms: 'Nama Penuh',
          },
          {
            en: 'Gender',
            ms: 'Jantina',
          },
          {
            en: 'MyKAD ID',
            ms: 'ID MyKAD',
          },
          {
            en: 'Phone Number',
            ms: 'Nombor Telefon',
          },
          {
            en: 'Military ID',
            ms: 'ID tentera',
          },
          {
            en: 'Armed Force Branch',
            ms: 'Cawangan Angkatan Tentera',
          },
          {
            en: 'Email Address',
            ms: 'Alamat E-mel',
          },
          {
            en: 'ID card image',
            ms: 'Gambar kad pengenalan',
          },
          {
            en: 'Selfie image',
            ms: 'Gambar selfie',
          },
        ],
      },
      {
        category: UserCategory.MINDEF_EMPLOY,
        values: [
          {
            en: 'Full Name',
            ms: 'Nama Penuh',
          },
          {
            en: 'Gender',
            ms: 'Jantina',
          },
          {
            en: 'MyKAD ID',
            ms: 'ID MyKAD',
          },
          {
            en: 'Phone Number',
            ms: 'Nombor Telefon',
          },
          {
            en: 'MINDEF Organization Title',
            ms: 'Tajuk Organisasi MINDEF',
          },
          {
            en: 'Email Address',
            ms: 'Alamat E-mel',
          },
          {
            en: 'ID card image',
            ms: 'Gambar kad pengenalan',
          },
          {
            en: 'Selfie image',
            ms: 'Gambar selfie',
          },
        ],
      },
      {
        category: UserCategory.VETERANS,
        values: [
          {
            en: 'Full Name',
            ms: 'Nama Penuh',
          },
          {
            en: 'Gender',
            ms: 'Jantina',
          },
          {
            en: 'MyKAD ID',
            ms: 'ID MyKAD',
          },
          {
            en: 'Phone Number',
            ms: 'Nombor Telefon',
          },
          {
            en: 'Military Branch (Retired)',
            ms: 'Cawangan Tentera (Bersara)',
          },
          {
            en: 'Email Address',
            ms: 'Alamat E-mel',
          },
          {
            en: 'ID card image',
            ms: 'Gambar kad pengenalan',
          },
          {
            en: 'Selfie image',
            ms: 'Gambar selfie',
          },
        ],
      },
    ];

    let resubmissionSortOrder = 1;
    for (const item of resubmissionReasons) {
      const categoryResult = await queryRunner.query(
        `SELECT id FROM "categories" WHERE value->>'en' = $1 LIMIT 1`,
        [item.category],
      );
      const categoryId = categoryResult?.[0]?.id;
      if (!categoryId) {
        throw new Error(`Category "${item.category}" not found.`);
      }

      for (const reason of item.values) {
        // Check if reason already exists
        const existingReason = await queryRunner.query(
          `SELECT id FROM "user_status_reasons" 
           WHERE user_category = $1 AND value->>'en' = $2 AND type = 'RESUBMISSION'`,
          [categoryId, reason.en],
        );

        if (!existingReason.length) {
          await queryRunner.query(
            `INSERT INTO "user_status_reasons" (
              user_category,
              value,
              description,
              type,
              is_active,
              sort_order
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              categoryId,
              JSON.stringify(reason),
              null,
              'RESUBMISSION',
              true,
              resubmissionSortOrder++,
            ],
          );
        } else {
          resubmissionSortOrder++; // Keep sort order consistent even if skipping
        }
      }
    }

    // Seed admin user if not exists
    const adminEmail = 'ahsan@paynest.ae';
    const existingAdmin = await queryRunner.query(
      `SELECT id FROM "gc_cms_users" WHERE email = $1 LIMIT 1`,
      [adminEmail],
    );

    if (!existingAdmin.length) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('ahsan123', salt);

      await queryRunner.query(`
        INSERT INTO "gc_cms_users" (
          "first_name", 
          "last_name", 
          "email", 
          "password", 
          "phone_number",
          "gc_cms_category_id"
        )
        VALUES (
          'Muhammad',
          'Hamza',
          '${adminEmail}',
          '${hashedPassword}',
          '+923110357070',
          (SELECT id FROM "gc_cms_user_categories" WHERE value->>'en' = 'Admin')
        );
      `);
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

async function main() {
  try {
    const dataSource = AppDataSource.isInitialized
      ? AppDataSource
      : await AppDataSource.initialize();
    await seedGCCMS(dataSource);
    await dataSource.destroy();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

void main();
