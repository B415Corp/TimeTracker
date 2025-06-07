import { RoleComponentFeature } from "@/features/role/RoleComponentFeature";
import { PROJECT_ROLE } from "@/shared/enums";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  roles: Array<PROJECT_ROLE>;
  userRole: PROJECT_ROLE;
  showChildren?: boolean;
  children: React.ReactNode;
}

/**
 * Widget-прокси: просто вызывает feature-компонент RoleComponentFeature
 */
export default function RoleComponent(props: Props) {
  return <RoleComponentFeature {...props} />;
}
