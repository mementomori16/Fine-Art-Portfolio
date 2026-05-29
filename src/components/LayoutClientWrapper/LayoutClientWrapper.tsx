"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MysteriousCurtain from "../MysteriousCurtain/MysteriousCurtain";

interface LayoutClientManagerProps {
  children: React.ReactNode;
}

export default function LayoutClientManager({ children }: LayoutClientManagerProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  const [mounted, setMounted] = useState(false);
  const [curtainHasOpened, setCurtainHasOpened] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // FIX: Prevents server/client HTML divergence by matching layout outputs until mounting is complete
  if (!mounted) {
    return <>{children}</>;
  }

  if (isHome) {
    return (
      <MysteriousCurtain 
        forceOpen={curtainHasOpened} 
        onOpen={() => setCurtainHasOpened(true)}
      >
        {children}
      </MysteriousCurtain>
    );
  }

  return <>{children}</>;
}