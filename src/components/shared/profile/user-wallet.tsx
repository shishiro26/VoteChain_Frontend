import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/store/useWallet";

const UserWallet = () => {
  const { wallet } = useWallet();
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Wallet Information</CardTitle>
        <CardDescription>Your blockchain wallet details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">
            Connected Wallet Address
          </p>
          <p className="font-mono break-all">{wallet}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Connection Status</p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <p className="font-medium">Connected</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(`https://etherscan.io/address/${wallet}`, "_blank")
            }
          >
            View on Etherscan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserWallet;
