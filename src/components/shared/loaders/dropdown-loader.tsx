import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DropdownLoaderProps {
  count?: number;
  className?: string;
}

export function DropdownLoader({ count = 5, className }: DropdownLoaderProps) {
  return (
    <div className={cn("flex flex-col gap-2 p-1", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className=" h-6 w-full rounded-md" />
      ))}
    </div>
  );
}
