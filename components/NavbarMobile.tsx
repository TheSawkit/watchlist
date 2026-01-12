"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Settings, Menu, X } from "lucide-react"
import { SignoutButton } from "@/components/SignoutButton"
import { NavLinks } from "@/components/NavLinks"

interface NavbarMobileProps {
  user: {
    user_metadata: {
      full_name?: string
      picture?: string
      email?: string
    }
  }
}

export function NavbarMobile({ user }: NavbarMobileProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const menuContent = isOpen && (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-surface/50 backdrop-blur-xs md:hidden"
        style={{
          animation: "backdropBlur 300ms ease-out",
        }}
        onClick={closeMenu}
      />
 
      {/* Menu latéral */}
      <div
        className="fixed inset-y-0 left-0 z-50 w-80 bg-surface border-r border-border shadow-lg overflow-y-auto md:hidden"
        style={{
          animation: "slideInFromLeft 300ms ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
            <div className="flex flex-col h-full">
              {/* Header avec avatar */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={
                      user.user_metadata.picture
                        ? user.user_metadata.picture
                        : `https://api.dicebear.com/9.x/initials/svg?seed=${
                            user.user_metadata.full_name
                              ? user.user_metadata.full_name
                              : user.user_metadata.email?.split("@")[0] || "user"
                          }&size=128&backgroundType=gradientLinear&backgroundColor=d97706&fontWeight=600&fontFamily=Tahoma&chars=1`}
                    alt="User avatar"
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                  <div>
                    <p className="text-sm font-medium text-text">
                      {user.user_metadata.full_name || "Utilisateur"}
                    </p>
                    <p className="text-xs text-muted">{user.user_metadata.email || ""}</p>
                  </div>
                </div>

                {/* Actions utilisateur */}
                <div className="flex flex-col gap-2 mt-4">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-muted hover:text-text hover:bg-surface-2 transition-colors"
                    onClick={closeMenu}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                  <div className="px-4">
                    <SignoutButton />
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-4">
                <NavLinks onLinkClick={closeMenu} />
              </div>
            </div>
          </div>
    </>
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Menu overlay via portal */}
      {typeof window !== "undefined" && isOpen && createPortal(menuContent, document.body)}
    </>
  )
}
