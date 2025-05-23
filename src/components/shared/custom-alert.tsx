import React from "react";
import { useNavigate } from "react-router";
import { useWallet } from "@/store/useWallet";
import { AlertCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const SessionExpiredAlert = () => {
  const navigate = useNavigate();
  const { walletAddress, connectThroughAuth } = useWallet();
  const [isOpen, setIsOpen] = React.useState(false);
  const resolverRef = React.useRef<() => void | null>(null);
  const { disconnectWallet } = useWallet();
  React.useEffect(() => {
    const handler = (event: CustomEvent) => {
      setIsOpen(true);
      resolverRef.current = event.detail;
    };
    window.addEventListener("sessionExpired", handler as EventListener);

    return () =>
      window.removeEventListener("sessionExpired", handler as EventListener);
  }, []);

  const handleConfirm = () => {
    if (walletAddress) {
      connectThroughAuth(walletAddress);
      setIsOpen(false);
      if (resolverRef.current) resolverRef.current();
    }
  };

  const handleDismiss = () => {
    disconnectWallet();
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current();
    navigate("/");
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Session Expired
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session has expired. Please reconnect your wallet to continue
            using the application.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDismiss}>Dismiss</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Reconnect Wallet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
