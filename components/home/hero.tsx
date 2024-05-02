import { FC } from "react";

interface HeroProps {}

const Hero: FC<HeroProps> = ({}) => {
  return (
    <>
      <div>
        <div className="text-center flex flex-col justify-center items-center align-middle">
          <h1 className="text-[40px] md:text-8xl font-satoshiBold bg-gradient-to-r bg-clip-text text-transparent from-indigo-700  to-indigo-300 animate-text">
            Kenniscentrum
          </h1>
          <h2 className=" ">Where knowledge begins</h2>
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
        <div className="mt-5 flex flex-col text-center">
          <p className="text-center">
            Kenniscentrum is an AI powered application made using Google Gemini
            APIs{" "}
          </p>
          <p>
            The APIs in use are gemini-pro, text-embedding-004, and
            gemini-1.5-pro-latest
          </p>
        </div>
      </div>
    </>
  );
};

export default Hero;
