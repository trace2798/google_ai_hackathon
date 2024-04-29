import { MobileHeader } from "@/components/navbar/mobile-header";
import { Sidebar } from "@/components/navbar/sidebar";

type Props = {
  children: React.ReactNode;
};

const MarketingLayout = ({ children }: Props) => {
  return (
    <>
     {children}
    </>
  );
};

export default MarketingLayout;
