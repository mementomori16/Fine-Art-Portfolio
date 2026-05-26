"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import MysteriousCurtain from "../MysteriousCurtain/MysteriousCurtain";

interface LayoutClientManagerProps {
  children: React.ReactNode;
}

export default function LayoutClientManager({ children }: LayoutClientManagerProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Handles resetting the scroll bar position smoothly between navigation steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  if (isHome) {
    return <MysteriousCurtain>{children}</MysteriousCurtain>;
  }

  return <>{children}</>;
}