import { useGetUserQuery } from "@/shared/api/user.service";
import { useParams } from "react-router-dom";
import { UserMeFeature } from "./UserMeFeature";
import { UserExternalFeature } from "./UserExternalFeature";

/**
 * Feature-компонент: страница пользователя с логикой выбора варианта отображения
 */
export function UserPageFeature() {
  const { id } = useParams<{ id: string }>();
  const { data: userMe } = useGetUserQuery();
  return (
    <div className="flex flex-col w-full h-full">
      {userMe?.user_id === id ? <UserMeFeature /> : <UserExternalFeature />}
    </div>
  );
} 