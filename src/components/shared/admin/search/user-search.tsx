import React from "react";
import { Search, Wallet, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchUser } from "@/hooks/use-search-user";
import { getStatusBadge } from "@/utils/status-badge";

type UserSearchProps = {
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
};

const UserSearch: React.FC<UserSearchProps> = ({
  selectedUser,
  onUserSelect,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState<User[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  const searchUser = useSearchUser();

  const handleWalletSearch = () => {
    if (searchUser.isPending || !searchTerm.trim()) return;

    setHasSearched(true);
    searchUser.mutate(
      {
        walletAddress: searchTerm.trim(),
        status: "approved",
        role: "user",
      },
      {
        onSuccess: (data) => {
          setResults(data);
        },
        onError: () => {
          setResults([]);
        },
      }
    );
  };

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by wallet address..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={handleWalletSearch}
            disabled={searchUser.isPending || !searchTerm.trim()}
          >
            {searchUser.isPending ? (
              <Loader size="sm" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {searchUser.isPending ? (
        <div className="flex justify-center py-4">
          <Loader size="md" text="Searching..." />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-3 max-h-[200px] overflow-y-auto mb-4">
          <p className="text-sm text-muted-foreground">
            Select a user to be the party leader:
          </p>
          {results.map((user) => {
            return (
              <Card
                key={user.id}
                className="p-3 hover:bg-accent cursor-pointer"
                onClick={() => {
                  onUserSelect(user);
                }}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={user.profileImage || "/placeholder.svg"}
                      alt={user.firstName || "User"}
                    />
                    <AvatarFallback>
                      {user.firstName.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {user.firstName} {user.lastName}
                      {getStatusBadge(user.status)}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email || "No email"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.walletAddress}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" type="button">
                    <UserCheck className="h-4 w-4 mr-1" /> Select
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : hasSearched && !searchUser.isPending && results.length === 0 ? (
        <div className="text-center py-4 mb-4">
          <p className="text-muted-foreground">
            No users found with this wallet address.
          </p>
        </div>
      ) : null}

      {selectedUser && (
        <div className="bg-primary/5 p-3 rounded-md mb-4 border border-primary/20">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={selectedUser.profileImage || "/placeholder.svg"}
                alt={selectedUser.firstName}
              />
              <AvatarFallback>
                {selectedUser.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">
                {selectedUser.firstName} {selectedUser.lastName}
                {getStatusBadge(selectedUser.status)}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedUser.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {selectedUser.walletAddress}
              </p>
            </div>
            <Badge className="bg-green-500 text-white">Selected</Badge>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(UserSearch);
