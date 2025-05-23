import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Wallet, KeyRound } from "lucide-react";
import { useWallet } from "@/store/useWallet";

export default function LoginPage() {
  const { connectThroughAuth, connecting } = useWallet();
  const [manualWallet, setManualWallet] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("connect");

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!manualWallet || manualWallet.trim() === "") {
        console.error("Invalid wallet address");
        return;
      }

      await connectThroughAuth(manualWallet);
      window.location.href = import.meta.env.VITE_FRONTEND_URL;
    } catch (error) {
      console.error("Error submitting wallet address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (connecting) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>VoteChain Login</CardTitle>
            <CardDescription>Checking authentication status...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to VoteChain
          </CardTitle>
          <CardDescription>
            Login to access the blockchain voting platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="connect">Connect Wallet</TabsTrigger>
              <TabsTrigger value="manual">Enter Wallet Address</TabsTrigger>
            </TabsList>

            <TabsContent value="connect" className="space-y-4">
              <div className="text-center py-4">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-sm text-muted-foreground mb-6">
                  Connect your wallet to authenticate and access the VoteChain
                  platform.
                </p>
                <Button
                  onClick={() => {
                    window.location.href = import.meta.env.VITE_FRONTEND_URL;
                  }}
                  className="w-full"
                >
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="manual">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <KeyRound className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Enter your wallet address manually to login.
                  </p>
                </div>

                <div className="space-y-2">
                  <Input
                    id="walletAddress"
                    placeholder="Enter your wallet address"
                    value={manualWallet}
                    onChange={(e) => setManualWallet(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="on"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-center text-muted-foreground">
            By logging in, you agree to the terms and conditions of the
            VoteChain platform.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
