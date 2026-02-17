import { SidebarMenuItem, SidebarMenuButton } from "@ui/sidebar";
import { SUBSCRIPTION } from "@/shared/enums";
import { ALL_SUBSCRIPTIONS } from "@/shared/constants";
import { PrivateComponentFeature } from "@/features/auth/PrivateComponentFeature";
import { HTMLAttributes } from "react";
import { useLocation } from "react-router-dom";

interface Props extends HTMLAttributes<HTMLDivElement> {
  tooltip: string;
  pathname: string;
  subscription?: SUBSCRIPTION[];
  isIncludePath?: boolean;
  component?: React.ReactNode;
}

export default function SidebarItemFeature({
  children,
  pathname,
  tooltip,
  subscription = ALL_SUBSCRIPTIONS,
  isIncludePath = true,
  component = null,
}: Props) {
  const location = useLocation();
  return (
    <PrivateComponentFeature lockPosition="left" subscriptions={subscription}>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={tooltip}
          isActive={
            !isIncludePath
              ? location.pathname === "/"
              : location.pathname.includes(pathname)
          }
        >
          {children}
        </SidebarMenuButton>
        {component}
      </SidebarMenuItem>
    </PrivateComponentFeature>
  );
}
