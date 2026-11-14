"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface SignOutButtonProps extends Omit<ButtonProps, "onClick"> {
  callbackUrl?: string;
}

export function SignOutButton({
  callbackUrl = "/guestbook",
  className,
  children = "Đăng xuất",
  variant = "ghost",
  size = "sm",
  disabled,
  ...props
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({ callbackUrl });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      loading={isLoading}
      disabled={disabled || isLoading}
      onClick={handleSignOut}
      aria-label="Đăng xuất khỏi hệ thống"
      iconLeft={
        <LogOut
          className="h-4 w-4 shrink-0 aspect-square"
          aria-hidden="true"
        />
      }
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}
