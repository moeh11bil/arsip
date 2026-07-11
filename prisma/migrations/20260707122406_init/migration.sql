-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NULL,
    `nis` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'KEPALA_SEKOLAH', 'TU', 'GURU', 'SISWA', 'AUDITOR') NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_nip_key`(`nip`),
    UNIQUE INDEX `users_nis_key`(`nis`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sessions_token_key`(`token`),
    INDEX `sessions_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `kodeDokumen` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NULL,
    `kategori` ENUM('AKADEMIK', 'KESISWAAN', 'KEPEGAWAIAN', 'ADMINISTRATIF', 'KEUANGAN', 'LEGALITAS', 'MEDIA', 'LAINNYA') NOT NULL,
    `subKategori` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'ARCHIVED', 'EXPIRED', 'DESTROYED') NOT NULL DEFAULT 'ACTIVE',
    `accessLevel` ENUM('PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL', 'SECRET') NOT NULL DEFAULT 'INTERNAL',
    `nomorSurat` VARCHAR(191) NULL,
    `tanggalSurat` DATETIME(3) NULL,
    `pengirim` VARCHAR(191) NULL,
    `perihal` VARCHAR(191) NULL,
    `tanggalDokumen` DATETIME(3) NOT NULL,
    `masaRetensiThn` INTEGER NOT NULL DEFAULT 5,
    `expiredAt` DATETIME(3) NULL,
    `fileSize` INTEGER NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `pageCount` INTEGER NULL,
    `checksum` VARCHAR(191) NULL,
    `ocrText` TEXT NULL,
    `isOcrProcessed` BOOLEAN NOT NULL DEFAULT false,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `downloadCount` INTEGER NOT NULL DEFAULT 0,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `documents_kodeDokumen_key`(`kodeDokumen`),
    INDEX `documents_kategori_idx`(`kategori`),
    INDEX `documents_status_idx`(`status`),
    INDEX `documents_accessLevel_idx`(`accessLevel`),
    INDEX `documents_tanggalDokumen_idx`(`tanggalDokumen`),
    INDEX `documents_kodeDokumen_idx`(`kodeDokumen`),
    INDEX `documents_createdById_idx`(`createdById`),
    INDEX `documents_deletedAt_idx`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_uploads` (
    `id` VARCHAR(191) NOT NULL,
    `documentId` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `uploadedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `document_uploads_documentId_idx`(`documentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_versions` (
    `id` VARCHAR(191) NOT NULL,
    `documentId` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `changeNote` TEXT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `document_versions_documentId_idx`(`documentId`),
    UNIQUE INDEX `document_versions_documentId_version_key`(`documentId`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_tags` (
    `id` VARCHAR(191) NOT NULL,
    `documentId` VARCHAR(191) NOT NULL,
    `tag` VARCHAR(191) NOT NULL,

    INDEX `document_tags_tag_idx`(`tag`),
    UNIQUE INDEX `document_tags_documentId_tag_key`(`documentId`, `tag`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_accesses` (
    `id` VARCHAR(191) NOT NULL,
    `documentId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `accessedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `document_accesses_documentId_idx`(`documentId`),
    INDEX `document_accesses_userId_idx`(`userId`),
    INDEX `document_accesses_accessedAt_idx`(`accessedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `surat` (
    `id` VARCHAR(191) NOT NULL,
    `documentId` VARCHAR(191) NOT NULL,
    `type` ENUM('MASUK', 'KELUAR') NOT NULL,
    `nomorAgenda` VARCHAR(191) NOT NULL,
    `nomorSurat` VARCHAR(191) NOT NULL,
    `tanggalSurat` DATETIME(3) NOT NULL,
    `tanggalTerima` DATETIME(3) NULL,
    `pengirim` VARCHAR(191) NULL,
    `tujuan` VARCHAR(191) NULL,
    `perihal` VARCHAR(191) NOT NULL,
    `priority` ENUM('BIASA', 'SEGERA', 'SANGAT_SEGERA') NOT NULL DEFAULT 'BIASA',
    `sifat` VARCHAR(191) NULL,
    `catatan` TEXT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `surat_documentId_key`(`documentId`),
    UNIQUE INDEX `surat_nomorAgenda_key`(`nomorAgenda`),
    INDEX `surat_type_idx`(`type`),
    INDEX `surat_tanggalSurat_idx`(`tanggalSurat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disposisi` (
    `id` VARCHAR(191) NOT NULL,
    `suratId` VARCHAR(191) NOT NULL,
    `fromUserId` VARCHAR(191) NOT NULL,
    `toUserId` VARCHAR(191) NOT NULL,
    `instruksi` TEXT NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `catatanRespon` TEXT NULL,
    `respondedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `disposisi_suratId_idx`(`suratId`),
    INDEX `disposisi_toUserId_status_idx`(`toUserId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` ENUM('CREATE', 'READ', 'UPDATE', 'DELETE', 'DOWNLOAD', 'PRINT', 'SHARE', 'LOGIN', 'LOGOUT', 'DISPOSITION') NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `oldValue` JSON NULL,
    `newValue` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_userId_idx`(`userId`),
    INDEX `audit_logs_entity_entityId_idx`(`entity`, `entityId`),
    INDEX `audit_logs_action_idx`(`action`),
    INDEX `audit_logs_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unit_kerja` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `unit_kerja_nama_key`(`nama`),
    UNIQUE INDEX `unit_kerja_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `klasifikasi_arsip` (
    `id` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NULL,
    `kategori` ENUM('AKADEMIK', 'KESISWAAN', 'KEPEGAWAIAN', 'ADMINISTRATIF', 'KEUANGAN', 'LEGALITAS', 'MEDIA', 'LAINNYA') NOT NULL,
    `retensiThn` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `parentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `klasifikasi_arsip_kode_key`(`kode`),
    INDEX `klasifikasi_arsip_kategori_idx`(`kategori`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_uploads` ADD CONSTRAINT `document_uploads_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_uploads` ADD CONSTRAINT `document_uploads_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_versions` ADD CONSTRAINT `document_versions_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_versions` ADD CONSTRAINT `document_versions_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_tags` ADD CONSTRAINT `document_tags_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_accesses` ADD CONSTRAINT `document_accesses_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `surat` ADD CONSTRAINT `surat_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `documents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `surat` ADD CONSTRAINT `surat_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disposisi` ADD CONSTRAINT `disposisi_suratId_fkey` FOREIGN KEY (`suratId`) REFERENCES `surat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disposisi` ADD CONSTRAINT `disposisi_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `disposisi` ADD CONSTRAINT `disposisi_toUserId_fkey` FOREIGN KEY (`toUserId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unit_kerja` ADD CONSTRAINT `unit_kerja_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `unit_kerja`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `klasifikasi_arsip` ADD CONSTRAINT `klasifikasi_arsip_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `klasifikasi_arsip`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
