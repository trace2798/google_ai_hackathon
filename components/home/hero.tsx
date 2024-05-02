import { FC } from "react";

interface HeroProps {}

const Hero: FC<HeroProps> = ({}) => {
  return (
    <>
      <div>
        <div className="text-center flex flex-col justify-center items-center align-middle">
          <h1 className="text-[40px] md:text-8xl font-satoshiBold bg-gradient-to-r bg-clip-text text-transparent from-yellow-500 via-purple-500 to-red-500 animate-text">
            Kenniscentrum
          </h1>
          <h2 className=" ">Where search begins</h2>
          <h3 className="max-w-sm text-muted-foreground">
            Kenniscentrum is my submisssion for{" "}
            <a
              className="hover:text-indigo-500"
              target="_blank"
              href="https://googleai.devpost.com/"
            >
              Google AI Hackathon
            </a>{" "}
            hosted through{" "}
            <a
              className="hover:text-indigo-500"
              target="_blank"
              href="https://www.devpost.com/"
            >
              Devpost
            </a>
          </h3>
        </div>
      </div>
    </>
  );
};

export default Hero;
