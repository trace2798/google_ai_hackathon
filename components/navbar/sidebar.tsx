import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  currentUser,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
};

export const Sidebar = async ({ className }: Props) => {
  const user = await currentUser();
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <h1 className="text-xl font-extrabold tracking-wide">
            Kenniscentrum
          </h1>
        </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="Search Web" href="/web-search" />
        <SidebarItem label="Wikipedia" href="/wiki" />
        <SidebarItem label="Document" href="/documents" />
        {user && (
          <>
            <SidebarItem label="Activity" href="/activity" />
            <SidebarItem label="Settings" href="/settings" />
            <SidebarItem label="Restore Files" href="/deleted" />
          </>
        )}
        {!user && (
          <>
            <div className="flex flex-col items-center gap-y-8">
              <div className="flex flex-col items-center gap-y-3 max-w-[330px] w-full">
                <ClerkLoading>
                  <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                  <SignedOut>
                    <SignUpButton
                      mode="modal"
                      afterSignInUrl="/web-search"
                      afterSignUpUrl="/web-search"
                    >
                      <Button size="lg" variant="secondary" className="w-full">
                        Get Started
                      </Button>
                    </SignUpButton>
                    <SignInButton
                      mode="modal"
                      afterSignInUrl="/web-search"
                      afterSignUpUrl="/web-search"
                    >
                      <Button size="lg" variant="outline" className="w-full">
                        I already have an account
                      </Button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full"
                      asChild
                    >
                      <Link href="/web-search">Continue Learning</Link>
                    </Button>
                  </SignedIn>
                </ClerkLoaded>
              </div>
            </div>
          </>
        )}
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
