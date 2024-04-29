import { FC } from "react";
import { initialProfile } from "@/lib/initial-profile";

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const profile = await initialProfile();
  return (
    <>
      <div>Page</div>
    </>
  );
};

export default Page;
