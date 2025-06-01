import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, Copy, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { copyToClipboard } from "@/utils/copy_to_clipboard";
import { useGetTransactionsQuery } from "@/api";
import { useWallet } from "@/store/useWallet";
import { useSearchParams } from "react-router";
import Pagination from "../pagination";

interface TransactionExplorerProps {
  networkName?: string;
}

interface TransactionProps {
  id: string;
  userId: string;
  transactionHash: string;
  amount: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  type: string;
  blockNumber: number;
  gasUsed: string | null;
  cumulativeGasUsed: string | null;
  effectiveGasPrice: string | null;
  contractAddress: string | null;
  to: string;
  from: string;
  createdAt: string;
  updatedAt: string;
}

export default function TransactionExplorer({
  networkName = "sepolia",
}: TransactionExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { walletAddress } = useWallet();
  const { data, isLoading } = useGetTransactionsQuery({
    page: 1,
    limit: 10,
    sortBy: "createdAt:desc",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const filteredTransactions = (data && data.data.results) || [];
  const totalPages = data?.query?.totalPages || 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      searchParams.set("page", page.toString());
      setSearchParams(searchParams);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const getEtherscanUrl = (hash: string) => {
    return `https://${
      networkName === "mainnet" ? "" : networkName + "."
    }etherscan.io/tx/${hash}`;
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "Vote Cast":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "USER REGISTRATION":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      case "ELECTION CREATED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Candidate Added":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "USER VERIFIED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "PARTY REGISTERED":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Blockchain Transactions</span>
          {walletAddress && (
            <Badge variant="outline" className="ml-2">
              Wallet: {truncateAddress(walletAddress)}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          View and verify all transactions on the blockchain
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hash or address"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tx Hash</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Block</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading transactions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <span>No transactions found</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx: TransactionProps) => (
                    <TableRow key={tx.transactionHash}>
                      <TableCell className="font-mono text-xs">
                        {truncateAddress(tx.transactionHash)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getTransactionTypeColor(tx.type)}
                        >
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.blockNumber}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(tx.createdAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {truncateAddress(tx.from)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {truncateAddress(tx.to)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => copyToClipboard(tx.transactionHash)}
                            title="Copy transaction hash"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              window.open(
                                getEtherscanUrl(tx.transactionHash),
                                "_blank"
                              )
                            }
                            title="View on Etherscan"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
            />
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing transactions on {networkName} network
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            window.open(
              `https://${
                networkName === "mainnet" ? "" : networkName + "."
              }etherscan.io${walletAddress ? "/address/" + walletAddress : ""}`,
              "_blank"
            )
          }
        >
          View All on Etherscan
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
