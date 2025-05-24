/// <reference types="vite/client" />
import { Eip1193Provider } from "ethers";

declare global {
  interface Window {
    ethereum: Eip1193Provider;
  }

  type SocialUrls = {
    twitter: string | null;
    facebook: string | null;
    instagram: string | null;
  };

  type TokenStatus = "ACTIVE" | "USED" | "EXPIRED";

  type Token = {
    token: string;
    expiryTime: string;
    status: TokenStatus;
  };

  type PartyMember = {
    id: string;
    name: string;
    email: string;
    wallet_address: string;
    role: string;
  };

  type Party = {
    id: string;
    name: string;
    symbol: string;
    abbreviation: string;
    logo: string;
    description: string;
    contact_email: string;
    contact_phone: string;
    website: string;
    social_urls: SocialUrls;
    founded_on: string;
    headquarters: string;
    leader_email: string;
    leader_wallet_address: string;
    leader_name: string;
    tokens: Token[];
    partyMembersCount: number;
    partyMembers: PartyMember[];
  };

  enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    PHEAD = "PHEAD",
  }

  enum Status {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    INCOMPLETE = "INCOMPLETE",
  }

  type PartySummary = {
    id: string;
    name: string;
    symbol: string;
    logo: string;
  };

  type Location = {
    stateName: string;
    districtName: string;
    constituencyName: string;
  };

  type User = {
    id: string;
    walletAddress: string;
    status: Status;
    role: Role;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    profileImage: string;
    aadharImage: string;
    aadharNumber: string;
    dob: string;
    party?: PartySummary;
    location: Location;
  };
}
