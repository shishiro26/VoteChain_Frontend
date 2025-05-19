import { toast } from "sonner";

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast("Copied to clipboard", {
      description: "The text has been copied to your clipboard.",
      duration: 2000,
    });
  });
};
