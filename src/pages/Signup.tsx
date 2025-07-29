import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";
import { signupUser } from "@/lib/authService";
import { SignupData, LoginData } from "../lib/types";

export default function SignupPage() {
  const handleSignup = async (data: SignupData | LoginData): Promise<void> => {
    try {
      if ("username" in data) {
        await signupUser(data.username, data.email, data.password);
      }
    } catch (err: any) {
      throw new Error(err.message || "Signup failed");
    }
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-6 py-12">
      <div className="border-muted bg-card w-full max-w-md rounded-2xl border p-10 shadow-xl">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Create your MindNest account
          </h1>
          <p className="text-muted-foreground text-sm">
            Start building your intelligent nest.
          </p>
          <hr className="border-muted my-4" />
        </div>
        <AuthForm type="signup" onSubmit={handleSignup} />
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="hover:text-primary underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
