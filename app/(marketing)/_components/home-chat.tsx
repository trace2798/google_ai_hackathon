"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCompletion } from "ai/react";
import { useTheme } from "next-themes";
import { BeatLoader } from "react-spinners";

export default function HomeChat() {
  const {
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: "/api/real",
  });
  const { theme } = useTheme();
  return (
    <div className="w-full flex flex-col justify-center ">
      <form onSubmit={handleSubmit}>
        <Textarea
          value={input}
          placeholder="Enter your prompt..."
          onChange={handleInputChange}
        />

        {/* <Button type="button" onClick={stop}>
          Stop
        </Button> */}
        <Button disabled={isLoading} type="submit" className="mt-5">
          Submit
        </Button>
      </form>
      <div className="mt-10">
        <p>
          {isLoading && (
            <div className="p-1 rounded-lg w-1/2 flex items-center justify-center bg-muted mt-10">
              <BeatLoader
                color={theme === "light" ? "black" : "white"}
                size={5}
              />
            </div>
          )}{" "}
          {}
          input: {input}
          <br />
          Completion result:{completion?.split("Final Answer: ")[1]}
        </p>
      </div>
    </div>
  );
}
