import { useGetUserQuery } from "@/shared/api/user.service";
import { useParams } from "react-router-dom";
import { UserMeFeature } from "@/features/user/UserMeFeature";
import { UserExternalFeature } from "@/features/user/UserExternalFeature";

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const { data: userMe } = useGetUserQuery();

  return (
    <div className="flex flex-col w-full h-full">
      {userMe?.user_id === id ? <UserMeFeature /> : <UserExternalFeature />}
    </div>
  );
}
