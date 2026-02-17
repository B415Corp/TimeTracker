import { Badge } from "@ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { PROJECT_ROLE } from "@/shared/enums";
import { useRole } from "@/hooks/use-role";
import { ShieldX } from "lucide-react";
import { HTMLAttributes, useState, useCallback, memo } from "react";
import RoleBadge from "@/entities/role/role-badge";

interface Props extends HTMLAttributes<HTMLDivElement> {
  roles: Array<PROJECT_ROLE>;
  userRole: PROJECT_ROLE;
  showChildren?: boolean;
  children: React.ReactNode;
}

/**
 * Feature-компонент: ограничение доступа по роли, с диалогом и блокировкой
 */
export const RoleComponentFeature = memo(function RoleComponentFeature({
  roles,
  userRole,
  showChildren = true,
  children,
  ...props
}: Props) {
  const { hasAccess } = useRole(roles, userRole);
  const [dialog, setDialog] = useState<boolean>(false);
  const isDevMode = import.meta.env.MODE === "dev";

  // Обработчик клика - открываем диалог только если доступа нет
  const accessHandler = useCallback(() => {
    if (!hasAccess && !isDevMode) {
      setDialog(true);
    }
  }, [hasAccess, isDevMode]);

  // В dev режиме всегда показываем контент
  if (isDevMode) {
    return <>{children}</>;
  }

  // Если доступа нет и showChildren === false - ничего не рендерим
  if (!hasAccess && !showChildren) {
    return null;
  }

  return (
    <>
      <div
        onClick={accessHandler}
        {...props}
        style={{ cursor: hasAccess ? "unset" : "default" }}
      >
        <div
          className={`relative ${
            !hasAccess ? "pointer-events-none grayscale-[100%] opacity-90" : ""
          }`}
        >
          {!hasAccess && (
            <div className="absolute p-1 duration-75 bg-black/70 w-full h-full text-rose-400 z-10 bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center justify-center">
              <Badge variant={"secondary"}>
                <ShieldX />
              </Badge>
            </div>
          )}
          {children}
        </div>
      </div>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ограничение доступа</DialogTitle>
            <div className="flex flex-col gap-2">
              <p>Эта функция доступна только пользователям с ролью:</p>
              <div className="uppercase space-x-3">
                {roles.map((el) => (
                  <RoleBadge key={el} role={el} />
                ))}
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}); 