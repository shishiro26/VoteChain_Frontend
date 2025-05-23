// No need for Zustand to store wallet/role again
import { useWallet } from "../store/useWallet";

export const useAuth = () => {
  const { walletAddress, role } = useWallet();

  const isAuthenticated = !!walletAddress;
  const checkIsAdmin = role === "ADMIN";
  const checkIsPartyLeader = role === "PHEAD";
  const checkIsCandidate = role === "CANDIDATE";

  return {
    walletAddress,
    role,
    isAuthenticated,
    checkIsAdmin,
    checkIsPartyLeader,
    checkIsCandidate,
  };
};
