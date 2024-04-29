"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import Image from "next/image";

type Props = {
  label: string;
  // iconSrc?: string;
  href: string;
};

export const SidebarItem = ({
  label,
  href,
}: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      variant={active ? "secondary" : "special"}
      className="justify-start h-[52px] hover:bg-secondary"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
