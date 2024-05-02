import Hero from "@/components/home/hero";
import HomeChat from "./_components/home-chat";

export default function Home() {
  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2 h-full">
      {/* <HomeChat /> */}
      <Hero />
    </div>
  );
}
