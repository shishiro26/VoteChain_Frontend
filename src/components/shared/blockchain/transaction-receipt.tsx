import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Info,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export type TransactionDetails = {
  txHash: string;
  timestamp: Date;
  blockNumber: number;
  operation: string;
  status: "success" | "pending" | "failed";
  details: {
    from: string;
    to: string | null;
    gasUsed: string;
    gasPrice?: string | null;
  };
  networkName: "mainnet" | "sepolia" | "goerli" | "polygon" | string;
};

interface TransactionReceiptProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  transaction: TransactionDetails | null;
  showDownloadOption?: boolean;
  showExplorerLink?: boolean;
}

export function TransactionReceipt({
  isOpen,
  onClose,
  transaction,
  showDownloadOption = true,
  showExplorerLink = true,
}: TransactionReceiptProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!transaction) {
    return null; // If no transaction data is provided, render nothing
  }

  const handleCopyTxHash = () => {
    navigator.clipboard.writeText(transaction.txHash);
    setIsCopied(true);

    toast.info("Transaction hash copied", {
      description: "The transaction hash has been copied to your clipboard.",
    });

    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    setIsDownloading(true);

    setTimeout(() => {
      const receiptData = {
        ...transaction,
        timestamp: transaction.timestamp.toISOString(),
      };

      const blob = new Blob([JSON.stringify(receiptData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `transaction-${transaction.txHash.substring(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsDownloading(false);

      toast.info("Receipt downloaded", {
        description: "Your transaction receipt has been downloaded.",
      });
    }, 1500);
  };

  const getExplorerBaseUrl = (network: string) => {
    switch (network) {
      case "sepolia":
        return "https://sepolia.etherscan.io";
      case "goerli":
        return "https://goerli.etherscan.io";
      case "polygon":
        return "https://polygonscan.com";
      case "mainnet":
      default:
        return "https://etherscan.io";
    }
  };

  const handleViewOnExplorer = () => {
    const baseUrl = getExplorerBaseUrl(transaction.networkName);
    const explorerUrl = `${baseUrl}/tx/${transaction.txHash}`;
    window.open(explorerUrl, "_blank");
  };

  const getStatusBadge = () => {
    switch (transaction.status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return null;
    }
  };

  const formatDetailValue = (value: unknown) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object" && value instanceof Date)
      return format(value, "PPpp");
    if (typeof value === "object") return JSON.stringify(value);
    return value.toString();
  };

  const formatGwei = (wei?: string | null) => {
    if (!wei) return "—";
    const gwei = parseFloat(wei) / 1e9;
    return `${gwei.toFixed(2)} Gwei`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Transaction Receipt
          </DialogTitle>
          <DialogDescription>
            Details of your blockchain transaction. Save this for your records.
          </DialogDescription>
        </DialogHeader>

        <Card className="border-2 border-dashed">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {transaction.operation}
                </CardTitle>
                <CardDescription>
                  {format(transaction.timestamp, "PPpp")}
                </CardDescription>
              </div>
              {getStatusBadge()}
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Transaction Hash</h4>
                <div className="flex items-center">
                  <code className="bg-muted px-2 py-1 rounded text-xs flex-1 overflow-hidden text-ellipsis">
                    {transaction.txHash}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={handleCopyTxHash}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {transaction.blockNumber && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Block Number</h4>
                  <p className="text-sm text-muted-foreground">
                    {transaction.blockNumber}
                  </p>
                </div>
              )}

              {transaction.networkName && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Network</h4>
                  <p className="text-sm text-muted-foreground">
                    {transaction.networkName}
                  </p>
                </div>
              )}

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">
                  Transaction Details
                </h4>
                <div className="space-y-2">
                  {Object.entries(transaction.details).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-2">
                      <p className="text-xs font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis">
                        {key === "gasPrice"
                          ? formatGwei(value as string)
                          : formatDetailValue(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Info className="h-3 w-3 mr-1" />
              This receipt is stored on the blockchain and cannot be altered.
            </div>
          </CardFooter>
        </Card>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {showExplorerLink && (
            <Button
              variant="outline"
              onClick={handleViewOnExplorer}
              className="sm:mr-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </Button>
          )}

          {showDownloadOption && (
            <Button onClick={handleDownloadReceipt} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
