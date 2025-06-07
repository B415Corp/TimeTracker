import {
  useEditUserNameMutation,
  useGetUserQuery,
} from "@/shared/api/user.service";
import { Loader } from "lucide-react";
import { useGetSubscriptionsQuery } from "@/shared/api/subscriptions.service";
import { Separator } from "@ui/separator";
import { Button } from "@ui/button";
import { AccountNameForm } from "@/features/settings/forms/AccountNameForm";
import { UserAvatar } from "@/entities/user";

export function AccountTab() {
  const { data: userData } = useGetUserQuery();
  const { data: subscriptionData } = useGetSubscriptionsQuery();
  const [editName, { isLoading }] = useEditUserNameMutation();

  if (!userData || !subscriptionData) {
    return <Loader className="animate-spin" />;
  }
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader className="animate-spin" />
        ) : (
          <UserAvatar
            size="large"
            name={userData.name}
            planId={subscriptionData?.planId}
          />
        )}
        <div>
          <p className="text-xs font-light opacity-75">Имя</p>
          <AccountNameForm
            initialName={userData.name}
            isLoading={isLoading}
            onSubmit={editName}
          />
        </div>
      </div>
      <div>
        <h2 className="pb-4">Безопасность учетной записи</h2>
        <Separator />
        <div className="py-4 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="">Email</p>
            <h5 className="text-sm font-light text-gray-400">
              {userData?.email}
            </h5>
          </div>
          <Button variant={"outline"}>Изменть email</Button>
        </div>
        <div className="py-4 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="">Пароль</p>
            <h5 className="text-sm font-light text-gray-400">
              Установите постоянный пароль для входа в свою учетную запись
            </h5>
          </div>
          <Button variant={"outline"}>Изменть пароль</Button>
        </div>
      </div>
    </div>
  );
}
