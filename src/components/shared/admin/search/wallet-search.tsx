import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Wallet,
  UserCheck,
  LoaderIcon,
  Eye,
  X,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useSearchUser } from "@/hooks/use-search-user";

interface GlobalWalletSearchProps {
  onUserSelect: (user: User) => void;
  buttonText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  buttonVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  buttonIcon?: React.ReactNode;
  filterStatus?: "all" | "approved" | "pending" | "rejected";
  excludePartyIds?: string[];
  className?: string;
  fullWidth?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

export function WalletSearch({
  onUserSelect,
  buttonText = "Search by Wallet",
  dialogTitle = "Find User by Wallet Address",
  dialogDescription = "Search for a user by wallet address",
  buttonVariant = "outline",
  buttonIcon = <Wallet className="mr-2 h-4 w-4" />,
  filterStatus = "approved",
  excludePartyIds = [],
  className = "",
  fullWidth = false,
  size = "default",
}: GlobalWalletSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [walletSearchTerm, setWalletSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const searchUser = useSearchUser();

  const handleWalletSearch = () => {
    if (!walletSearchTerm.trim()) return;

    setIsSearching(true);
    setSearchResults([]);

    searchUser.mutate(
      {
        walletAddress: walletSearchTerm.trim(),
        status: filterStatus,
        role: "user,phead",
        inParty: "true",
      },
      {
        onSuccess: (data) => {
          const filteredResults = data.filter(
            (user: User) =>
              user.party && !excludePartyIds.includes(user.party.id)
          );
          setSearchResults(filteredResults);
          setIsSearching(false);
        },
        onError: () => {
          setIsSearching(false);
        },
      }
    );
  };

  const handleSelectUser = (user: User) => {
    onUserSelect(user);
    setShowUserDetails(false);
    setWalletSearchTerm("");
    setSearchResults((prev) =>
      prev.filter(
        (result) => result.party && result.party.id !== user.party?.id
      )
    );
    setSelectedUser(null);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  useEffect(() => {
    if (!isOpen) {
      setWalletSearchTerm("");
      setSearchResults([]);
      setSelectedUser(null);
      setShowUserDetails(false);
    }
  }, [isOpen]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "party_leader":
        return (
          <Badge className="bg-primary text-primary-foreground">
            Party Leader
          </Badge>
        );
      case "party_member":
        return <Badge variant="secondary">Party Member</Badge>;
      case "admin":
        return <Badge className="bg-purple-500 text-white">Admin</Badge>;
      case "voter":
      default:
        return <Badge variant="outline">Voter</Badge>;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant={buttonVariant}
            className={className}
            style={fullWidth ? { width: "100%" } : {}}
            size={size}
          >
            {buttonIcon}
            {buttonText}
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-2xl">
          {!showUserDetails ? (
            <>
              <DialogHeader>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogDescription>{dialogDescription}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Enter wallet address (e.g., 0x1a2b3c...)"
                      className="pl-10"
                      value={walletSearchTerm}
                      onChange={(e) => setWalletSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleWalletSearch();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleWalletSearch}
                    disabled={isSearching || !walletSearchTerm.trim()}
                  >
                    {isSearching ? (
                      <LoaderIcon className="h-4 w-4 animate-spin" />
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
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    <p className="text-sm text-muted-foreground">
                      Found {searchResults.length} user(s):
                    </p>
                    {searchResults.map((user) => (
                      <Card key={user.id} className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={user.profileImage || "/placeholder.svg"}
                              alt={`${user.firstName} ${user.lastName}`}
                            />
                            <AvatarFallback>
                              {user.firstName?.[0]}
                              {user.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              {getRoleBadge(user.role)}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {user.email}
                            </p>
                            <p className="text-xs text-muted-foreground truncate font-mono">
                              {user.walletAddress}
                            </p>
                            {user.party && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-sm">
                                  {user.party.symbol}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {user.party.name}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(user)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSelectUser(user)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" /> Select
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : walletSearchTerm && !isSearching ? (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      No users found with this wallet address.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try searching with a different wallet address.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Enter a wallet address to search for users.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Try these sample addresses:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => setWalletSearchTerm("0x1a2b3c")}
                        >
                          0x1a2b3c...
                        </Badge>
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => setWalletSearchTerm("0x5e6f7g")}
                        >
                          0x5e6f7g...
                        </Badge>
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => setWalletSearchTerm("0x7g8h9i")}
                        >
                          0x7g8h9i...
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="flex items-center gap-2">
                      User Details
                      {selectedUser && getRoleBadge(selectedUser.role)}
                    </DialogTitle>
                    <DialogDescription>
                      Detailed information about the selected user
                    </DialogDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowUserDetails(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              {selectedUser && (
                <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={selectedUser.profileImage || "/placeholder.svg"}
                        alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      />
                      <AvatarFallback className="text-lg">
                        {selectedUser.firstName?.[0]}
                        {selectedUser.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedUser.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        {selectedUser.walletAddress}
                      </p>
                    </div>
                  </div>
                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Phone Number
                      </p>
                      <p className="text-sm">
                        {selectedUser.phoneNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Date of Birth
                      </p>
                      <p className="text-sm">
                        {selectedUser.dob
                          ? format(new Date(selectedUser.dob), "PPP")
                          : "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Aadhaar Number
                      </p>
                      <p className="text-sm">
                        {selectedUser.aadharNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <Badge variant="outline" className="capitalize">
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {selectedUser.party && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">
                          Party Affiliation
                        </h4>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src={
                                selectedUser.party.logo || "/placeholder.svg"
                              }
                              alt={selectedUser.party.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              <span className="text-xl">
                                {selectedUser.party.symbol}
                              </span>
                              {selectedUser.party.name}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {selectedUser.role.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowUserDetails(false)}
                >
                  Back to Search
                </Button>
                <Button
                  onClick={() => selectedUser && handleSelectUser(selectedUser)}
                  disabled={!selectedUser}
                >
                  <UserCheck className="h-4 w-4 mr-1" /> Select User
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
