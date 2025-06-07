import { ROUTES } from "@/app/router/routes.enum";
import { Button } from "@ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import { Separator } from "@ui/separator";
import UserAvatar from "@/shared/ui/base/user-avatar";
import { useGetSubscriptionsQuery } from "@/shared/api/subscriptions.service";
import {
  useEditUserNameMutation,
  useGetUserByIdQuery,
} from "@/shared/api/user.service";

import {
  EditUserNameDTO,
  EditUserNameSchema,
} from "@/shared/interfaces/user.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { UserNameForm } from "@/features/user/forms/UserNameForm";

export default function UserMePage() {
  const { id } = useParams<{ id: string }>();
  const { data: userData } = useGetUserByIdQuery(id || "", { skip: !id });
  const [editName, { isLoading }] = useEditUserNameMutation();
  const { data: subscriptionData } = useGetSubscriptionsQuery();

  if (!userData || !subscriptionData) {
    return <Loader className="animate-spin" />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-2 items-center p-4">
        {isLoading ? (
          <Loader className="animate-spin" />
        ) : (
          <UserAvatar
            size="small"
            name={userData.name}
            planId={subscriptionData?.planId}
          />
        )}
        <UserNameForm
          initialName={userData.name}
          isLoading={isLoading}
          onSubmit={editName}
          inputClassName="rounded-lg text-xl font-bold"
        />
      </div>
      <div className="flex flex-col p-4 w-full gap-8">
        <div className="w-full flex flex-col">
          <div className="flex items-center gap-2 pb-4">
            <Sparkles className="size-5" />
            <h2 className="font-semibold">Подписка</h2>
          </div>
          <Separator />
          <div className="py-4 flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <p className="">Текущий план</p>
              <h5 className="text-sm font-light text-gray-400 uppercase">
                {subscriptionData?.planId}
              </h5>
            </div>
            <Link to={`/${ROUTES.PLANS}`}>
              <Button variant={"outline"}>
                <Sparkles className="size-4" />
                Обновить до Pro
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <div className="flex items-center gap-2 pb-4">
            <ShieldCheck className="size-5" />
            <h2 className="font-semibold">Безопасность учетной записи</h2>
          </div>
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
    </div>
  );
}
