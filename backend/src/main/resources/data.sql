
-- Keeps the notifications table in sync with the ENotificationType enum.
-- NOTE: Spring's SQL script runner splits on ';' and does NOT support PL/pgSQL
-- DO $$ blocks, so we keep this to simple, individually-idempotent statements.
-- The stale CHECK constraint would reject newer enum values
-- (RESERVATION_REQUESTED / MEMBERSHIP_REQUESTED), and ddl-auto=update never
-- touches existing constraints — so we simply remove it. Value validity is
-- enforced application-side by @Enumerated(EnumType.STRING).
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
