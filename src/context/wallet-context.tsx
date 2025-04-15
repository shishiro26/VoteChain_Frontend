"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface WalletContextType {
  wallet: string | null
  connecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isProfileComplete: boolean
  setIsProfileComplete: (value: boolean) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const router = useRouter()

  // Check if wallet is already connected on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet")
    const profileComplete = localStorage.getItem("profileComplete") === "true"

    if (savedWallet) {
      setWallet(savedWallet)
    }

    setIsProfileComplete(profileComplete)

    // Show modal if profile is not complete and user is logged in
    if (savedWallet && !profileComplete) {
      const hasShownModal = sessionStorage.getItem("modalShown")
      if (!hasShownModal && router) {
        setTimeout(() => {
        //   toast({
        //     title: "Profile Incomplete",
        //     description:
        //       "You haven't completed profile verification. Please update your profile to continue using VoteChain.",
        //     action: (
        //       <button
        //         className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-xs font-medium"
        //         onClick={() => router.push("/update-profile")}
        //       >
        //         Update Profile
        //       </button>
        //     ),
        //     duration: 10000,
        //   })
          sessionStorage.setItem("modalShown", "true")
        }, 1000)
      }
    }
  }, [router, toast])

  const connectWallet = async () => {
    setConnecting(true)

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        // toast({
        //   title: "MetaMask not found",
        //   description: "Please install MetaMask to use this application",
        //   variant: "destructive",
        // })
        return
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const account = accounts[0]

      setWallet(account)
      localStorage.setItem("wallet", account)

    //   toast({
    //     title: "Wallet Connected",
    //     description: "Your MetaMask wallet has been connected successfully",
    //   })
    } catch (error) {
      console.error("Error connecting wallet:", error)
    //   toast({
    //     title: "Connection Failed",
    //     description: "Failed to connect to MetaMask. Please try again.",
    //     variant: "destructive",
    //   })
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    localStorage.removeItem("wallet")
    // toast({
    //   title: "Wallet Disconnected",
    //   description: "Your wallet has been disconnected",
    // })
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connecting,
        connectWallet,
        disconnectWallet,
        isProfileComplete,
        setIsProfileComplete: (value) => {
          setIsProfileComplete(value)
          localStorage.setItem("profileComplete", value.toString())
        },
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Add TypeScript declaration for window.ethereum
import { Eip1193Provider } from 'ethers';

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}
