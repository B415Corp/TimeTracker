import { SUBSCRIPTION } from "@/shared/enums";
const variantByType = {
  [SUBSCRIPTION.FREE]: { mouth: "variant3" },
  [SUBSCRIPTION.BASIC]: { mouth: "variant1" },
  [SUBSCRIPTION.PREMIUM]: { mouth: "variant2" },
};

// const rootUrl = 'https://api.dicebear.com/9.x/fun-emoji'
const types = {
  funEmoji: "fun-emoji",
  thumbs: "thumbs",
  shapes: "shapes",
};

export function getUserAvatarUrl(
  seed: string,
  type: SUBSCRIPTION = SUBSCRIPTION.FREE
) {
  return `https://api.dicebear.com/9.x/${types.thumbs}/svg?seed=${seed}&mouth=${variantByType[type as SUBSCRIPTION].mouth}`;
}

export function getClientAvatarUrl(
  seed: string,
) {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}`;
}