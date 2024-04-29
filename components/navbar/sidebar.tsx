import Link from "next/link";
import Image from "next/image";
import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Building, Building2, Loader } from "lucide-react";

import { cn } from "@/lib/utils";

import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/organizations">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <h1 className="text-xl font-extrabold tracking-wide">
            Kenniscentrum
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem
          label="Search Web"
          href="/web-search"
          // iconSrc="/globe.svg"
          // icon={Building2}
        />
        <SidebarItem
          label="Wikipedia"
          href="/wiki"
          // iconSrc="/leaderboard.svg"
          // icon={Building}
        />
        <SidebarItem
          label="Document"
          href="/documents"
          // iconSrc="/globe.svg"
          // icon={Building}
        />
        <SidebarItem
          label="History"
          href="/history"
          // iconSrc="/globe.svg"
          // icon={Building}
        />
        <SidebarItem
          label="Settings"
          href="/settings"
          // iconSrc="/globe.svg"
          // icon={Building}
        />
        {/* <SidebarItem
          label="Settings"
          href="/settings"
          // iconSrc="/leaderboard.svg"
          // icon={Building}
        /> */}

        {/* <SidebarItem label="quests" href="/quests" />
        <SidebarItem label="shop" href="/shop"  /> */}
      </div>
      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
      {/* <div className="text-muted-foreground text-xs">
        Submission for Google AI Hackathon
      </div> */}
    </div>
  );
};
