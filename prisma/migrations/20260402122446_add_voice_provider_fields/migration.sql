-- AlterTable: Rename voiceCloneId to providerVoiceId for clarity
ALTER TABLE "VoiceSample" DROP COLUMN IF EXISTS "voiceCloneId";
ALTER TABLE "VoiceSample" ADD COLUMN IF NOT EXISTS "providerVoiceId" TEXT;
