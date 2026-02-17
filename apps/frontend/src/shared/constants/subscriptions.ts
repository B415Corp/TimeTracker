import { SUBSCRIPTION } from "@/shared/enums";

/**
 * Все доступные подписки (включая FREE)
 */
export const ALL_SUBSCRIPTIONS = [
  SUBSCRIPTION.FREE,
  SUBSCRIPTION.BASIC,
  SUBSCRIPTION.PREMIUM,
] as const;

/**
 * Платные подписки (без FREE)
 */
export const PAID_SUBSCRIPTIONS = [
  SUBSCRIPTION.BASIC,
  SUBSCRIPTION.PREMIUM,
] as const;
