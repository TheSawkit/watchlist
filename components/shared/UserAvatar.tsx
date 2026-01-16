"use client"

import { useEffect, useState } from "react"
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
  const [goldColor, setGoldColor] = useState<string>("d97706")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const goldHex = getComputedStyle(document.documentElement)
        .getPropertyValue("--gold")
        .trim()
        .replace("#", "")
      if (goldHex) {
        setGoldColor(goldHex)
      }
    }
  }, [])

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
