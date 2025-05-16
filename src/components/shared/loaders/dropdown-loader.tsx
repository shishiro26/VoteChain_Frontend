import { Loader2 } from "lucide-react";

export function DropdownLoader() {
  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-muted-foreground">Loading...</span>
      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    </div>
  );
}
