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

export const SidebarItem = ({ label,
  //  iconSrc, 
   href }: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      variant={active ? "outline" : "secondary"}
      className="justify-start h-[52px] hover:bg-secondary"
      asChild
    >
      <Link href={href}>
        {/* <Icon 
          className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"
        /> */}
        {/* <Image
          src={iconSrc}
          alt={label}
          className="mr-5 text-primary"
          height={32}
          width={32}
        /> */}
        {label}
      </Link>
    </Button>
  );
};
