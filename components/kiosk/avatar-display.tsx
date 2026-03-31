import Image from "next/image";
import { isImageAvatar } from "@/lib/avatar";

interface AvatarDisplayProps {
  avatar: string;
  name: string;
  imageClassName?: string;
  textClassName?: string;
}

export function AvatarDisplay({
  avatar,
  name,
  imageClassName = "object-cover",
  textClassName = "leading-none"
}: AvatarDisplayProps) {
  const value = avatar.trim();

  if (isImageAvatar(value)) {
    return (
      <span className="relative block h-full w-full">
        <Image
          src={value}
          alt={`${name} avatar`}
          fill
          unoptimized
          sizes="128px"
          className={imageClassName}
          draggable={false}
        />
      </span>
    );
  }

  return <span className={textClassName}>{value || name.slice(0, 1).toUpperCase()}</span>;
}
