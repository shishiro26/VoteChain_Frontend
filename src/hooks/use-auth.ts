// No need for Zustand to store wallet/role again
import { useWallet } from "../store/useWallet";

export const useAuth = () => {
  const { wallet, role } = useWallet();

  const isAuthenticated = !!wallet;
  const checkIsAdmin = role === "admin";
  const checkIsPartyLeader = role === "phead";
  const checkIsCandidate = role === "candidate";

  return {
    wallet,
    role,
    isAuthenticated,
    checkIsAdmin,
    checkIsPartyLeader,
    checkIsCandidate,
  };
};
