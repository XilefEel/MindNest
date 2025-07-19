import AuthForm from "@/components/AuthForm";
import { Link } from "react-router-dom";
import { signupUser } from "@/lib/authService";
import { SignupData, LoginData } from "@/lib/authService";

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
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-md border border-muted bg-card rounded-2xl shadow-xl p-10">
        <div className="mb-6 text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Create your MindNest account
          </h1>
          <p className="text-muted-foreground text-sm">
            Start building your intelligent nest.
          </p>
          <hr className="border-muted my-4" />
        </div>
        <AuthForm type="signup" onSubmit={handleSignup} />
        <p className="mt-6 text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:text-primary">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
