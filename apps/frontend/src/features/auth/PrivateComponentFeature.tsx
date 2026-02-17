import { ROUTES } from "@/shared/enums";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { SUBSCRIPTION } from "@/shared/enums";
import { useSubscription } from "@/hooks/use-subscription";
import { LockKeyhole } from "lucide-react";
import { HTMLAttributes, useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";

interface Props extends HTMLAttributes<HTMLDivElement> {
  subscriptions: Array<SUBSCRIPTION>;
  lockPosition?: "left" | "right";
  children: React.ReactNode;
}

/**
 * Feature-компонент: ограничение доступа по подписке, с диалогом и блокировкой
 */
export const PrivateComponentFeature = memo(function PrivateComponentFeature({
  lockPosition = "left",
  subscriptions,
  children,
  ...props
}: Props) {
  const { access } = useSubscription(subscriptions);
  const [dialog, setDialog] = useState<boolean>(false);
  const isDevMode = import.meta.env.MODE === "dev";

  const accessHandler = useCallback(() => {
    if (!access && !isDevMode) {
      setDialog(true);
    }
  }, [access, isDevMode]);

  // В dev режиме всегда показываем контент без ограничений
  if (isDevMode) {
    return <>{children}</>;
  }

  return (
    <>
      <div onClick={accessHandler} {...props}>
        <div
          className={`${!access && "pointer-events-none grayscale-[100%]"} relative`}
        >
          {!access && (
            <Badge
              variant={"secondary"}
              className={`${lockPosition === "left" ? "left-1 -translate-x-1/2" : "right-1 translate-x-1/2"} absolute p-1 bg-black/50 text-rose-400 z-10 bottom-1 translate-y-2 uppercase`}
            >
              <LockKeyhole />
            </Badge>
          )}
          {children}
        </div>
      </div>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Подписка</DialogTitle>
            <div className="flex flex-col gap-2">
              <p>Эта функция доступна только пользователям с подписками:</p>
              <div className="pt-3 uppercase">
                {subscriptions.map((el) => (
                  <Badge key={el} className="mx-1">
                    {el}
                  </Badge>
                ))}
              </div>
              <Link className="mt-4 self-center" to={"/" + ROUTES.PLANS}>
                <Button>Обновить план</Button>
              </Link>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}); 