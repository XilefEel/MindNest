import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";
import { loginUser } from "@/lib/authService";
import { SignupData, LoginData } from "../lib/types";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: SignupData | LoginData) => {
    try {
      const user = await loginUser(data.email, data.password);
      login(user);
      navigate("/dashboard");
    } catch (err: any) {
      throw new Error(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-md border border-muted bg-card rounded-2xl shadow-xl p-10">
        <div className="mb-6 text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Welcome back to MindNest
          </h1>
          <p className="text-muted-foreground text-sm">
            Log in to access your Nest.
          </p>
          <hr className="border-muted my-4" />
        </div>

        <AuthForm type="login" onSubmit={handleLogin} />

        <p className="mt-6 text-sm text-muted-foreground text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="underline hover:text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
