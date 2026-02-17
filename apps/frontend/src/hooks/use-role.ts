import { useMemo } from "react";
import { PROJECT_ROLE } from "@/shared/enums";

interface RoleResult {
  hasAccess: boolean;
  userRole: PROJECT_ROLE;
}

/**
 * Хук для проверки доступа по роли в проекте
 * @param requiredRoles - массив требуемых ролей
 * @param userRole - текущая роль пользователя
 * @returns объект с флагом доступа и текущей ролью
 */
export function useRole(
  requiredRoles: PROJECT_ROLE[],
  userRole: PROJECT_ROLE
): RoleResult {
  return useMemo(() => {
    const hasAccess = requiredRoles.includes(userRole);
    return { hasAccess, userRole };
  }, [requiredRoles, userRole]);
}
