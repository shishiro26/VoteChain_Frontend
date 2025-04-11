import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Lock, Shield } from "lucide-react";
import { Link } from "react-router";
import { useWallet } from "./store/useWallet";

export default function Home() {
  const { wallet, connectWallet, connecting } = useWallet();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Empowering Transparent and Secure Elections with{" "}
            <span className="text-primary">Blockchain</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            VoteChain leverages blockchain technology and AI verification to
            enable fair, tamper-proof elections.
          </p>
          {wallet ? (
            <Link to="/vote">
              <Button size="lg" className="gap-2">
                Start Voting <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              onClick={connectWallet}
              disabled={connecting}
              className="gap-2"
            >
              {connecting ? "Connecting..." : "Connect MetaMask & Get Started"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-accent/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why VoteChain?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Decentralization</h3>
              <p className="text-muted-foreground">
                Eliminate central points of failure with blockchain technology
                that distributes voting records across a secure network.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Face & Aadhaar Verification
              </h3>
              <p className="text-muted-foreground">
                Advanced AI-powered verification ensures only eligible voters
                participate, preventing fraud and duplicate voting.
              </p>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Tamper-proof Voting
              </h3>
              <p className="text-muted-foreground">
                Once cast, votes cannot be altered or deleted, ensuring complete
                transparency and trust in the electoral process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Elections Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Traditional Elections Need Disruption
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-destructive/10 p-2 px-4 rounded-full mt-1">
                  <span className="text-destructive font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    Lack of Transparency
                  </h3>
                  <p className="text-muted-foreground">
                    Traditional voting systems often lack transparency, making
                    it difficult for voters to verify that their votes were
                    counted correctly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-destructive/10 p-2 px-4 rounded-full mt-1">
                  <span className="text-destructive font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    Vulnerability to Fraud
                  </h3>
                  <p className="text-muted-foreground">
                    Paper-based systems are susceptible to ballot stuffing,
                    manipulation, and other forms of electoral fraud.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-destructive/10 p-2 px-4 rounded-full mt-1">
                  <span className="text-destructive font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">
                    Inefficient Processes
                  </h3>
                  <p className="text-muted-foreground">
                    Manual counting and verification processes are
                    time-consuming, expensive, and prone to human error.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience the Future of Voting?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of forward-thinking citizens who are embracing
            secure, transparent blockchain voting.
          </p>
          {wallet ? (
            <div className="space-y-4">
              <p className="text-primary font-medium">Wallet Connected!</p>
              <Link to="/update-profile">
                <Button size="lg" className="gap-2">
                  Complete Your Profile <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <Button size="lg" onClick={connectWallet} disabled={connecting}>
              {connecting ? "Connecting..." : "Connect MetaMask & Join Now"}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
