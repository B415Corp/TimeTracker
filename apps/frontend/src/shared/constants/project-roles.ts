import { PROJECT_ROLE } from "@/shared/enums";

/**
 * Только владелец проекта
 */
export const OWNER_ONLY = [PROJECT_ROLE.OWNER] as const;

/**
 * Владелец и менеджер (могут управлять проектом)
 */
export const PROJECT_MANAGERS = [
  PROJECT_ROLE.OWNER,
  PROJECT_ROLE.MANAGER,
] as const;

/**
 * Все роли в проекте
 */
export const ALL_PROJECT_ROLES = [
  PROJECT_ROLE.OWNER,
  PROJECT_ROLE.MANAGER,
  PROJECT_ROLE.EXECUTOR,
  PROJECT_ROLE.GUEST,
] as const;

/**
 * Роли участников (не владельцев) - для функции "покинуть проект"
 */
export const PROJECT_MEMBERS = [
  PROJECT_ROLE.MANAGER,
  PROJECT_ROLE.EXECUTOR,
  PROJECT_ROLE.GUEST,
] as const;
