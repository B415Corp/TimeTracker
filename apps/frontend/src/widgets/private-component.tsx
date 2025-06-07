import { PrivateComponentFeature } from "@/features/auth/PrivateComponentFeature";
import { SUBSCRIPTION } from "@/shared/enums";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  subscriptions: Array<SUBSCRIPTION>;
  lockPosition?: "left" | "right";
  children: React.ReactNode;
}

/**
 * Widget-прокси: просто вызывает feature-компонент PrivateComponentFeature
 */
export default function PrivateComponent(props: Props) {
  return <PrivateComponentFeature {...props} />;
}
