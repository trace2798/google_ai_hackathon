"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const UploadDoc = () => {
  const [document, setDocument] = useState<File | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!document) {
      setError("Please upload the document first");
      return;
    }
    console.log("DOCUMENT FE", document);
    setIsLoading(true);
    const interval = startSimulatedProgress();

    const formData = new FormData();
    formData.append("uploadedFile", document as Blob);
    try {
      const res = await fetch("/api/index", {
        method: "POST",
        body: formData,
      });
      if (res.status === 200) {
        const data = await res.json();
        console.log("DATA", data);
        const documentId = data.id;
        toast.success("Document embedded successfully");
        router.push(`/documents/${documentId}`);
      }
    } catch (e) {
      console.log("error while generating", e);
    }
    clearInterval(interval);
    setIsLoading(false);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocument(e?.target?.files?.[0]);
    if (error) {
      setError("");
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="bg-secondary w-full flex h-32 rounded-md border-2 border-dashed relative hover:bg-secondary/50 hover:cursor-pointer">
          <div className="absolute inset-0 m-auto flex flex-col justify-center items-center">
            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">
                &nbsp;
                {uploadProgress <= 33 ? "Uploading" : "Embedding Document"}
              </span>
            </p>
            <div className="w-full mt-4 max-w-xs mx-auto">
              <Progress
                indicatorColor={
                  uploadProgress === 100 ? "bg-green-500" : "bg-blue-400"
                }
                value={uploadProgress}
                className="h-1 w-full bg-zinc-200"
              />
              {uploadProgress === 100 ? (
                <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Redirecting...
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <form className="w-full " onSubmit={handleSubmit}>
          <Label
            htmlFor="document"
            className="bg-secondary w-full flex h-32 rounded-md border-2 border-dashed relative hover:bg-secondary/50 hover:cursor-pointer"
          >
            <div className="absolute inset-0 m-auto flex justify-center items-center">
              {document && document?.name ? (
                document.name
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">&nbsp;Click to upload</span>{" "}
                    or drag and drop
                  </p>
                </>
              )}
            </div>
            <Input
              type="file"
              id="document"
              className="relative block w-full h-full z-50 opacity-0 hover:cursor-pointer"
              onChange={handleDocumentUpload}
              accept=".pdf,.txt,.md"
            />
          </Label>
          <p className="text-secondary-foreground my-2">
            Supported file types: pdf <br />
            <p className="text-muted-foreground text-sm">
              [Keeping privacy on mind, I am not storing the files on the
              server]
            </p>
          </p>
          {error ? <p className="text-red-600">{error}</p> : null}
          <Button disabled={!document} size="lg" className="mt-2" type="submit">
            Embed Document
          </Button>
        </form>
      )}
    </div>
  );
};

export default UploadDoc;
