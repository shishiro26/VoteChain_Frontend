import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Wallet } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Loader } from "../loaders/loader";

const party = {
  name: "Party Name",
  symbol: "PN",
  logo: "/placeholder.svg",
};

type User = {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  profileImage?: string;
};

// Simulated user data with wallet addresses
const allUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    walletAddress: "0xabc123",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    walletAddress: "0xdef456",
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    walletAddress: "0xghi789",
  },
  {
    id: "4",
    name: "Bob Brown",
    email: "bob.brown@example.com",
    walletAddress: "0xjkl012",
  },
  {
    id: "5",
    name: "Charlie Davis",
    email: "charlie.davis@example.com",
    walletAddress: "0xmnop345",
  },
];

const MembersSearchDialog = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false);
  const [walletSearchTerm, setWalletSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<User[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isInviting, setIsInviting] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const handleWalletSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);

    // Simulate API delay
    setTimeout(() => {
      const filtered = allUsers.filter(
        (user) =>
          user.walletAddress &&
          user.walletAddress
            .toLowerCase()
            .includes(walletSearchTerm.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 1000);
  };

  const handleInviteUser = async (user: User) => {
    setIsInviting(true);
    setSelectedUser(user);

    setTimeout(() => {
      setIsInviting(false);
      setIsInviteDialogOpen(false);
      setWalletSearchTerm("");
      setSearchResults([]);
      alert(`User ${user.name} invited successfully!`);
    }, 2000);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center gap-4">
        <img
          src={party.logo}
          alt={`${party.name} logo`}
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{party.name}</h1>
            <span className="text-2xl">{party.symbol}</span>
          </div>
          <p className="text-muted-foreground">Manage members and requests</p>
        </div>
      </div>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Invite Member
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New Member</DialogTitle>
            <DialogDescription>
              Search for a user by wallet address to invite them to your party.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Enter wallet address..."
                    className="pl-10"
                    value={walletSearchTerm}
                    onChange={(e) => setWalletSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="button"
                onClick={handleWalletSearch}
                disabled={isSearching || !walletSearchTerm.trim()}
              >
                {isSearching ? (
                  <Loader size="sm" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {isSearching ? (
              <div className="flex justify-center py-8">
                <Loader size="md" text="Searching..." />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                <p className="text-sm text-muted-foreground">
                  Select a user to invite:
                </p>
                {searchResults.map((user) => (
                  <Card
                    key={user.id}
                    className="p-3 hover:bg-accent cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={user.profileImage || "/placeholder.svg"}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.walletAddress}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isInviting && selectedUser?.id === user.id}
                        onClick={() => handleInviteUser(user)}
                      >
                        {isInviting && selectedUser?.id === user.id ? (
                          <Loader size="sm" className="mr-1" />
                        ) : (
                          <UserPlus className="h-4 w-4 mr-1" />
                        )}
                        Invite
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : walletSearchTerm && !isSearching ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  No users found with this wallet address.
                </p>
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsInviteDialogOpen(false);
                setWalletSearchTerm("");
                setSearchResults([]);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersSearchDialog;
