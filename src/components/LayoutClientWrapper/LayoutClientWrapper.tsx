"use client";

import React, { useEffect, useState } from "react";
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
  }, [pathname]);

  if (!mounted) return <>{children}</>;

  if (isHome) {
    // Safely convert children to an array
    const childrenArray = React.Children.toArray(children);
    
    // Assuming WelcomeHero is the first child. 
    // If you have many children, this separates the first from the rest.
    const hero = childrenArray[0];
    const rest = childrenArray.slice(1);

    return (
      <>
        <MysteriousCurtain 
          forceOpen={curtainHasOpened} 
          onOpen={() => setCurtainHasOpened(true)}
        >
          {hero}
        </MysteriousCurtain>
        {rest}
      </>
    );
  }

  return <>{children}</>;
}