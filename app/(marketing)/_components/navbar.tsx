"use client";
import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

import { Code2Icon, Search } from "lucide-react";


export const Navbar = () => {
//   const { data, status } = useSession();
//   const { onOpen } = useLoginModal();
//   const search = useSearch();
//   if (status === "loading") {
//     <h1>Loading</h1>;
//   }

  return (
    <>
      <div className="fixed top-0 w-full h-14 px-4 border-b border-muted backdrop-blur-md shadow-sm flex items-center z-50">
        <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
          <Link href="/">
            <Code2Icon />
          </Link>

          <div className="flex items-center align-center space-x-5">
            {/* <SearchCommand/> */}
            {/* <Button variant={"ghost"} onClick={search.onOpen}>
              <Search className="h-[1.2rem] w-[1.2rem]" />
              &nbsp;&nbsp;<span className="text-xs font-thin">ctrl + k</span>
            </Button> */}
            {/* <Link href={"/chat"}>
              <Button variant="ghost">Chat</Button>
            </Link> */}
            <ModeToggle />
            {/* {data?.user && <UserButton data={data} status={status} />}
            {status === "unauthenticated" && (
              <Button
                onClick={() => onOpen()}
                className="p-3 cursor-pointer"
                variant="secondary"
              >
                Login
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};