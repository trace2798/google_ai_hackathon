import { MobileHeader } from "@/components/navbar/mobile-header";
import { Sidebar } from "@/components/navbar/sidebar";

type Props = {
  children: React.ReactNode;
};

const MarketingLayout = ({ children }: Props) => {
  return (
    <>
      <div className="lg:hidden">
        <MobileHeader />
      </div>
      <Sidebar className="hidden lg:flex" />
      <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
        <div className="max-w-[1056px] mx-[5vw] lg:mx-auto pt-6 h-full">
          {children}
        </div>
      </main>
    </>
  );
};

export default MarketingLayout;
