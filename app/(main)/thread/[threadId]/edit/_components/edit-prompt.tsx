"use client";
import { Thread } from "@prisma/client";
import { FC, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateThreadPrompt } from "./updateThreadprompt";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface EditPromptProps {
  thread: Thread;
}

const formSchema = z.object({
  updatedPrompt: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});
const EditPrompt: FC<EditPromptProps> = ({ thread }) => {
  const [submit, isSubmit] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      updatedPrompt: "",
    },
  });

  const handleUpdateSubmit = async (values: z.infer<typeof formSchema>) => {
    isSubmit(true);
    //console.log(values);

    const data = await updateThreadPrompt(thread.id, values.updatedPrompt);
    //console.log(data);
    if (data === "Done") {
      toast.success("Prompt for the thread updated successfully");
    }
    isSubmit(false);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Prompt</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
            <DialogDescription>
              Change your prompt for the thread here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentPrompt" className="text-right">
                Current Prompt
              </Label>
              <Input
                id="currentPrompt"
                defaultValue={thread.prompt || ""}
                className="col-span-3"
                disabled
              />
            </div>
            <div className=" items-center gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleUpdateSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="updatedPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Prompt</FormLabel>
                        <FormControl>
                          <Textarea placeholder="" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={submit} type="submit">
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditPrompt;
