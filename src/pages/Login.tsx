import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";
import { loginUser } from "@/lib/api/user";
import { SignupData, LoginData } from "../lib/types/user";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react";

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
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6">
      <ArrowLeft
        className="text-muted-foreground absolute top-6 left-6 cursor-pointer transition-colors hover:text-teal-600"
        onClick={() => navigate("/")}
      />

      <div className="border-muted bg-card w-full max-w-md rounded-2xl border p-10 shadow-xl">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-teal-600 md:text-4xl">
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
          <Link
            to="/signup"
            className="underline transition-all duration-100 hover:text-teal-600"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
