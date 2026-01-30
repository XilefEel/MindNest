import AuthForm from "@/components/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "@/lib/api/user";
import { SignupData, LoginData } from "../lib/types/user";

export default function SignupPage() {
  const navigate = useNavigate();

  const handleSignup = async (data: SignupData | LoginData): Promise<void> => {
    if ("username" in data) {
      await signupUser(data.username, data.email, data.password);
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-100 px-6 py-12 dark:bg-gray-900">
      <div className="border-muted w-full max-w-md rounded-2xl border bg-white p-10 shadow-xl dark:border-gray-600 dark:bg-gray-800">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-teal-500 dark:text-teal-300">
            Sign Up
          </h1>
          <p className="text-muted-foreground text-sm">
            Create an account to start creating Nests!
          </p>
        </div>

        <hr className="border-muted my-6 dark:border-gray-500" />

        <AuthForm type="signup" onSubmit={handleSignup} />

        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline transition-all duration-100 hover:text-teal-600"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
