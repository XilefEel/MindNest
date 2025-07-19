import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupData, LoginData } from "@/lib/authService";

interface AuthFormProps {
  type: "signup" | "login";
  onSubmit: (data: SignupData | LoginData) => Promise<void>;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (type === "signup" && username.trim() === "") {
      setError("Username is required.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(
        type === "signup" ? { username, email, password } : { email, password }
      );
    } catch (err: any) {
      const message = err.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      {type === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            required
            placeholder="Your username"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          required
          placeholder="Your email address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          required
          placeholder="At least 6 characters"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        className="w-full mt-2 bg-black dark:bg-white text-white dark:text-black transition-transform hover:scale-105"
        disabled={loading}
      >
        {loading
          ? type === "signup"
            ? "Creating Account..."
            : "Logging In..."
          : type === "signup"
          ? "Create Account"
          : "Log In"}
      </Button>
    </form>
  );
}
