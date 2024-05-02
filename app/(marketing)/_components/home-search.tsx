"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FC } from "react";
import { useCompletion } from "ai/react";
import { useTheme } from "next-themes";
import { BeatLoader } from "react-spinners";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  searchInput: z.string().min(2).max(50),
});
interface HomeSearchProps {}

const HomeSearch: FC<HomeSearchProps> = ({}) => {
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchInput: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    //console.log("prompt:",values.searchInput);
    // handleSubmit(e);
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-center"
        >
          <FormField
            control={form.control}
            name="searchInput"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {/* <Input placeholder="shadcn" {...field} /> */}
                  <Textarea
                    // value={input}
                    // placeholder="Search web with AI"
                    // onChange={handleInputChange}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit" className="mt-5">
            Search
          </Button>
        </form>
      </Form>
    </>
  );
};

export default HomeSearch;
