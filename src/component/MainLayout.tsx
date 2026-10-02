"use client";

import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname === "/signin" || pathname === "/signup" || pathname === "/login" || pathname === "/register";

  return (
    <div className={isAuth ? "" : "md:ml-[264px]"}>
      {children}
    </div>
  );
}
