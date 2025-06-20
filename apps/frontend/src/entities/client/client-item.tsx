import React from "react";
import { UserAvatar } from "@/shared/ui/base/user-avatar";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { ClientAvatar } from "@/shared/ui/base/client-avatar";

interface ClientItemProps {
  name: string;
  additional_fields?: { type: string; value: string }[] | null;
}

/**
 * Компонент для отображения информации о клиенте
 */
const ClientItem: React.FC<ClientItemProps> = ({ name, additional_fields }) => {
  return (
    <div className="flex items-center gap-2">
      <ClientAvatar name={name} size="xs"/>
      {/* <UserAvatar name={name} planId={SUBSCRIPTION.FREE} size="xs" /> */}
      <div className="flex flex-col gap-1">
        <span className="font-medium">{name}</span>
      </div>
    </div>
  );
};

export default ClientItem; 