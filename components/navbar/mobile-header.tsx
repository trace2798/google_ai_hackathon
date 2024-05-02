import Link from "next/link";
import { MobileSidebar } from "./mobile-sidebar";

export const MobileHeader = () => {
  return (
    <nav className="lg:hidden px-6 h-[50px] flex items-center justify-between bg-secondary border-b fixed top-0 w-full z-50">
      <MobileSidebar />
      <Link href={"/"}>
        <h1 className="text-xl font-semibold tracking-wide bg-gradient-to-r bg-clip-text text-transparent from-indigo-500  to-indigo-300 hover:cursor-pointer">
          Kenniscentrum
        </h1>
      </Link>
    </nav>
  );
};
