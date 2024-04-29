import UploadDoc from "@/components/upload-doc";
import { FC } from "react";

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  return (
    <>
      {/* <div>
        Upload document functionality and list of documents will be here
      </div> */}
      <UploadDoc />
    </>
  );
};

export default Page;
