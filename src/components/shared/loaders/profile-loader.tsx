import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/shared/loaders/loader";

export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="border border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader size="md" />
                </div>
              </div>

              <div className="space-y-5">
                {/* Profile info skeletons */}
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-full max-w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Wallet Information</CardTitle>
              <CardDescription>Your blockchain wallet details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <Skeleton className="h-3 w-48 mb-2" />
                <Skeleton className="h-5 w-full" />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <Skeleton className="h-3 w-32 mb-2" />
                  <div className="flex items-center mt-1">
                    <Skeleton className="w-2 h-2 rounded-full mr-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <Skeleton className="h-9 w-36" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voting History</CardTitle>
              <CardDescription>
                Record of your past votes on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Election</th>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Transaction Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 2 }).map((_, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4">
                          <Skeleton className="h-4 w-48" />
                        </td>
                        <td className="py-2 px-4">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="py-2 px-4">
                          <Skeleton className="h-4 w-32" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
