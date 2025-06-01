import { ethers } from "ethers";

import AuthABI from "../contracts/Auth.json";
import AdminABI from "../contracts/Admin.json";
import PartyABI from "../contracts/Party.json";
import ElectionABI from "../contracts/ElectionContract.json";

export const CONTRACT_ADDRESSES = {
  auth: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  admin: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  party: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  election: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  electionAdmin: "0x937dc20632378d010c5e21c12ce511f5512aff41",
  deployer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
};

export const getProvider = (): ethers.BrowserProvider => {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

export const getAuthContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES.auth, AuthABI.abi, signer);
};

export const getAdminContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES.admin, AdminABI.abi, signer);
};

export const getPartyContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES.party, PartyABI.abi, signer);
};

export const getElectionContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESSES.election,
    ElectionABI.abi,
    signer
  );
};

export const checkElectionAdmin = async () => {
  try {
    const electionContract = await getElectionContract();
    const currentAdmin = await electionContract.admin();
    const currentAccount = await (await getSigner()).getAddress();

    console.log("Election Contract Admin:", currentAdmin);
    console.log("Current Account:", currentAccount);
    console.log(
      "Is Admin:",
      currentAdmin.toLowerCase() === currentAccount.toLowerCase()
    );

    return {
      admin: currentAdmin,
      currentAccount,
      isAdmin: currentAdmin.toLowerCase() === currentAccount.toLowerCase(),
    };
  } catch (error) {
    console.error("Error checking admin:", error);
    return null;
  }
};
