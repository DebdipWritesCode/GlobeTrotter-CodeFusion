import React from "react";
import NavbarCombined from "@/components/mvpblocks/header-1";

interface MainLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function MainLayout({ children, noPadding = false }: MainLayoutProps) {
  // On landing page we often want custom padding for specific sections
  return (
    <>
      <NavbarCombined />
      <main className={noPadding ? "" : "pt-6 md:pt-8 px-4 sm:px-6 lg:px-8"}>
        {children}
      </main>
    </>
  );
}