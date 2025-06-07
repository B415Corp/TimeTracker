import React from "react";

interface ClientItemProps {
  name: string;
  contact_info: string;
}

/**
 * Компонент для отображения информации о клиенте
 */
const ClientItem: React.FC<ClientItemProps> = ({ name, contact_info }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium">{name}</span>
      <span className="text-xs text-muted-foreground">{contact_info}</span>
    </div>
  );
};

export default ClientItem; 