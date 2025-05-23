import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Trash, User, UserPlus, Mail } from "lucide-react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "../loaders/loader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Dummy data (replace with real API data)
const initialMembers = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    joinedDate: "2024-05-01",
    profileImage: "",
    role: "leader",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    joinedDate: "2024-05-10",
    profileImage: "",
    role: "member",
  },
];

const PartyMembers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState(initialMembers);
  const [filteredMembers, setFilteredMembers] = useState(initialMembers);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    setFilteredMembers(
      members.filter(
        (m) =>
          m.name.toLowerCase().includes(lowerSearch) ||
          m.email.toLowerCase().includes(lowerSearch)
      )
    );
  }, [searchTerm, members]);

  const handleRemoveMember = async (id: string) => {
    setRemovingMemberId(id);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setMembers((prev) => prev.filter((member) => member.id !== id));
    } catch (err) {
      console.error("Failed to remove member:", err);
    } finally {
      setRemovingMemberId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Party Members</CardTitle>
          <CardDescription>Manage your party members</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members by name or email..."
              className="pl-10 w-1/2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={member.profileImage || "/placeholder.svg"}
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                        {member.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(member.joinedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {member.role === "leader" ? (
                        <Badge className="bg-primary text-primary-foreground">
                          Party Leader
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Member</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {member.role !== "leader" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={removingMemberId === member.id}
                          >
                            {removingMemberId === member.id ? (
                              <Loader size="sm" className="mr-1" />
                            ) : (
                              <Trash className="w-4 h-4 mr-1" />
                            )}
                            Remove
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Members Found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "No members match your search criteria."
                : "Your party doesn't have any members yet."}
            </p>
            {!searchTerm && (
              <Button
                className="mt-4"
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Invite Your First Member
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PartyMembers;
