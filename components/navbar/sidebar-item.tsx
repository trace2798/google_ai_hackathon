"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  // icon: LucideIcon;
  href: string;
};

export const SidebarItem = ({
  label,
  // icon: Icon,
  href,
}: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      variant={active ? "sidebarOutline" : "sidebar"}
      className="justify-start h-[52px] hover:bg-secondary"
      asChild
    >
      <Link href={href}>
        {/* <Image
          src={iconSrc}
          alt={label}
          className="mr-5"
          height={32}
          width={32}
        /> */}
        {/* <Icon 
          className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"
        /> */}
        {label}
      </Link>
    </Button>
  );
};
