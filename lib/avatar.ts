import type { UserRole } from "@/lib/types";

export const PARENT_AVATARS = ["👩", "👨", "🧑", "👵", "👴", "🙂", "😎", "🫶"];
export const CHILD_AVATARS = ["🦁", "🐼", "🐯", "🦊", "🐸", "🐻", "🦄", "🚀"];

export function getAvatarOptions(role: UserRole) {
  return role === "ebeveyn" ? PARENT_AVATARS : CHILD_AVATARS;
}

export function getDefaultAvatar(role: UserRole) {
  return getAvatarOptions(role)[0];
}

export function isImageAvatar(avatar: string) {
  const value = avatar.trim();

  return (
    value.startsWith("data:image/") ||
    value.startsWith("blob:") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  );
}

export function normalizeAvatarForRole(role: UserRole, avatar: string) {
  const value = avatar.trim();

  if (!value) {
    return getDefaultAvatar(role);
  }

  if (isImageAvatar(value)) {
    return value;
  }

  return getAvatarOptions(role).includes(value) ? value : getDefaultAvatar(role);
}
