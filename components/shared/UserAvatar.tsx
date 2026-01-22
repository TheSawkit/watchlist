"use client"

import Image from "next/image"

interface UserAvatarProps {
  picture?: string
  fullName?: string
  email?: string
  size?: number
  className?: string
}

export function UserAvatar({
  picture,
  fullName,
  email,
  size = 128,
  className,
}: UserAvatarProps) {
  const goldColor = "d6b25e"

  const avatarUrl = picture
    ? picture
    : `https://api.dicebear.com/9.x/initials/svg?seed=${
        fullName || email?.split("@")[0] || "user"
      }&size=${size}&backgroundType=gradientLinear&backgroundColor=${goldColor}&fontWeight=600&fontFamily=Tahoma&chars=1`

  return (
    <Image
      src={avatarUrl}
      alt="User avatar"
      width={size}
      height={size}
      className={className}
      unoptimized
    />
  )
}
