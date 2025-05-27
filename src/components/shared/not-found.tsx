import { Link } from "react-router";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound({
  text,
  link,
}: { text?: string; link?: string } = {}) {
  return (
    <div className="container flex items-center justify-center min-h-[80vh] px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-6">
              <FileQuestion className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
          <CardDescription className="text-lg mt-2">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            You might have followed a broken link, mistyped the address, or the
            page may have been relocated.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link to={link || "/"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {text || "Go Back Home"}
            </Link>
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            If you believe this is an error, please contact support.
          </p>
        </CardFooter>
      </Card>
    </div>
  );  
}
