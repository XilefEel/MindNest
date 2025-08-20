import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";
import { loginUser } from "@/lib/user";
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
    <div className="bg-background flex min-h-screen items-center justify-center px-6">
      <div className="border-muted bg-card w-full max-w-md rounded-2xl border p-10 shadow-xl">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Welcome back to MindNest
          </h1>
          <p className="text-muted-foreground text-sm">
            Log in to access your Nest.
          </p>
          <hr className="border-muted my-4" />
        </div>

        <AuthForm type="login" onSubmit={handleLogin} />

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="hover:text-primary underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
