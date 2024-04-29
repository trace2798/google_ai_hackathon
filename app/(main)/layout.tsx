import { initialProfile } from "@/lib/initial-profile";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: Props) => {
  await initialProfile();
  return (
    <>
      {children}
    </>
  );
};

export default MainLayout;
