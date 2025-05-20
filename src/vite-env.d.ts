/// <reference types="vite/client" />
import { Eip1193Provider } from "ethers";

declare global {
  interface Window {
    ethereum: Eip1193Provider;
  }

  interface Party {
    id: string;
    name: string;
    symbol: string;
    abbreviation: string;
    logo: string;
    description: string;
    contact_email: string;
    contact_phone: string;
    website: string;
    leader_name: string;
    leader_wallet_address: string;
    leader_email: string;
    verify_token: null | string;
    token_url: null | string;
    token_expiry: null | string;
    candidate_count: number;
    created_at: string;
    status: string;
    link_status: string;
  }
}
