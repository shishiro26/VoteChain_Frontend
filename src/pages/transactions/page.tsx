import TransactionExplorer from "@/components/shared/blockchain/transaction-explorer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TransactionsPage() {
  return (
    <div className="container mx-auto py-2 space-y-6">
      <TransactionExplorer />
      <Card>
        <CardHeader>
          <CardTitle>Understanding Blockchain Verification</CardTitle>
          <CardDescription>
            Learn how to verify transactions on the Ethereum blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">What is a transaction hash?</h3>
              <p className="text-sm text-muted-foreground">
                A transaction hash is a unique identifier for each transaction
                on the blockchain. It's created by applying a cryptographic hash
                function to the transaction data.
              </p>
            </div>

            <div>
              <h3 className="font-medium">How to verify a transaction</h3>
              <p className="text-sm text-muted-foreground">
                Click on the "Verify on Etherscan" button to open the
                transaction details on Etherscan, where you can see all
                transaction details including confirmations, gas fees, and
                execution status.
              </p>
            </div>

            <div>
              <h3 className="font-medium">Transaction receipts</h3>
              <p className="text-sm text-muted-foreground">
                After each transaction (voting, creating elections, etc.),
                you'll receive a transaction receipt that serves as proof of
                your interaction with the blockchain. You can download these
                receipts for your records or to verify the transaction later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
