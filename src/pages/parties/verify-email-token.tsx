import { useVerifyEmailToken } from "@/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { useWallet } from "@/store/useWallet";
import { AlertTriangle } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router";

const VerifyEmailToken = () => {
  const location = useLocation();
  const { wallet } = useWallet();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const token = params.get("token");
  const wallet_address = params.get("wallet_address");

  const approveToken = useVerifyEmailToken();

  React.useEffect(() => {
    if (!token || !wallet_address || wallet_address !== wallet) {
      navigate("/");
    }
  }, [token, wallet_address, wallet, navigate]);

  const onSubmit = () => {
    if (!token || !wallet_address) return;

    approveToken.mutate(
      { token, wallet_address },
      {
        onSuccess: (data) => {
          if (data?.token_url) {
            navigate(data.token_url);
          } else if (data?.errors) {
            console.error("Token verification errors:", data.errors);
          }
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Verify Email Token</CardTitle>
          <CardDescription>
            This page verifies your email address using the token sent to your
            email. If the token is valid, you'll be redirected. Otherwise,
            you'll need to request a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500 text-center" />
            <AlertDescription className="text-amber-500">
              Please ensure you are using the correct wallet address and token
              provided in the email. If you encounter any issues, please check
              your email for the correct link or contact support.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            {approveToken.isError && (
              <Alert className="mb-6 border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-500 text-center" />
                <AlertDescription className="text-red-500">
                  An error occurred while verifying your token. Please try
                  again.
                </AlertDescription>
              </Alert>
            )}

            {approveToken.isPending ? (
              <>
                <Loader size="lg" text="Verifying your token..." />
                <p className="mt-4 text-center text-muted-foreground">
                  Please wait while we verify your token. This may take a few
                  moments.
                </p>
              </>
            ) : (
              <>
                <p className="text-center text-muted-foreground">
                  Click the button below to verify your token.
                  <br />
                  If you have already verified your token, you will be
                  redirected to the appropriate page.
                </p>
                <Button onClick={onSubmit} disabled={approveToken.isPending}>
                  Verify Token
                </Button>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            If you have not received a token, please check your spam folder or
            request a new one.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailToken;
