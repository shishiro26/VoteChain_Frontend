import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Vote,
  BarChart3,
  Flag,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/store/useWallet";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation, useNavigate } from "react-router";

export default function Header() {
  const {
    wallet,
    connecting,
    connectWallet,
    disconnectWallet,
    is_profile_complete,
  } = useWallet();
  const { checkIsAdmin: isAdmin } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Vote", href: "/vote" },
    { name: "Results", href: "/results" },
    { name: "Parties", href: "/browse/parties" },
  ];

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <nav className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Vote className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold">VoteChain</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Admin Dashboard Link (if admin) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden md:flex items-center text-sm font-medium text-primary"
            >
              <ShieldCheck className="h-4 w-4 mr-1" />
              Admin
            </Link>
          )}

          {/* Wallet Connection */}
          {wallet ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  {truncateAddress(wallet)}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/parties" className="cursor-pointer">
                    <Flag className="h-4 w-4 mr-2" />
                    Parties
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={disconnectWallet}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={connectWallet}
              disabled={connecting}
              className="hidden md:flex"
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Navigation links */}
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium py-2 transition-colors",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Admin link if admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-medium py-2 text-primary flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              )}
            </div>

            {/* Wallet connection */}
            {wallet ? (
              <div className="space-y-3">
                <div className="flex items-center text-sm font-medium">
                  <User className="h-4 w-4 mr-2" />
                  {truncateAddress(wallet)}
                </div>
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/profile"
                    className="text-sm py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    className="justify-start text-destructive hover:text-destructive px-0"
                    onClick={() => {
                      disconnectWallet();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={connecting}
                className="w-full"
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      )}

      {wallet && !is_profile_complete && (
        <div className="bg-amber-500/90 text-white py-2 px-4 text-center">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <p>
              Your profile is incomplete. Please update your profile to access
              all features.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-amber-400 hover:bg-white/90 hover:text-amber-500 dark:bg-white dark:text-white opacity-70 border-white dark:hover:opacity-100 transition-opacity"
              onClick={() => navigate("/update-profile")}
            >
              Update Profile
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
