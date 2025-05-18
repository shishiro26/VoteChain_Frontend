import { useWallet } from "@/store/useWallet";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const { connectThroughAuth } = useWallet();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const wallet_address = formData.get("wallet_address") as string;
    await connectThroughAuth(wallet_address);
    navigate("/");
  };
  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div>
        <label htmlFor="wallet_address">Wallet Address</label>
        <input
          type="text"
          id="wallet_address"
          name="wallet_address"
          required
          className="border-2 border-amber-200"
        />
      </div>

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
