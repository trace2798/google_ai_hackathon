import Hero from "@/components/home/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-col items-center justify-center p-4 gap-2 pt-24 lg:pt-44">
      <Hero />
      <div className="my-5">In Kenniscentrum you can do the following:</div>
      <div className="max-w-xl w-full flex flex-col space-y-3 lg:space-y-0 lg:flex-row justify-evenly ">
        <Link href={"/web-search"}>
          <Button variant={"outline"} className="hover:text-indigo-500 ">
            Search Web
          </Button>
        </Link>
        <Link href={"/wiki"}>
          <Button variant={"outline"} className="hover:text-indigo-500 ">
            Search Wikipedia
          </Button>
        </Link>
        <Link href={"/documents"}>
          <Button variant={"outline"} className="hover:text-indigo-500 ">
            Chat with Document
          </Button>
        </Link>
      </div>
    </div>
  );
}
