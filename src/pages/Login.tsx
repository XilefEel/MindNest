import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";
import { loginUser } from "@/lib/api/user";
import { SignupData, LoginData } from "../lib/types/user";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: SignupData | LoginData) => {
    const user = await loginUser(data.email, data.password);
    login(user);
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-100 px-6 py-12 dark:bg-gray-900">
      <div className="border-muted w-full max-w-md rounded-2xl border bg-white p-10 shadow-xl dark:border-gray-600 dark:bg-gray-800">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-teal-500 dark:text-teal-300">
            Welcome Back to MindNest
          </h1>
          <p className="text-muted-foreground text-sm">
            Log in to access your Nests!
          </p>
        </div>

        <hr className="border-muted my-6 dark:border-gray-500" />

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
