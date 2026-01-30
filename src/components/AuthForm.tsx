import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupData, LoginData } from "@/lib/types/user";
import { toast } from "@/lib/utils/toast";
import { KeyRound, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils/general";

export default function AuthForm({
  type,
  onSubmit,
}: {
  type: "signup" | "login";
  onSubmit: (data: SignupData | LoginData) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast.error("Invalid email!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if (type === "signup" && !username.trim()) {
      toast.error("Username is required!");
      return;
    }

    setLoading(true);
    try {
      const data: SignupData | LoginData =
        type === "signup" ? { username, email, password } : { email, password };

      await onSubmit(data);
    } catch (error) {
      toast.error(`Failed to ${type}! Please try again.`);
      console.error(`Failed to ${type}!`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      {type === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="username">
            <User size={16} />
            Username
          </Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            required
            placeholder="Ex: JohnDoe"
            className="focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">
          <Mail size={16} /> Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          required
          placeholder="Ex: johndoe@example.com"
          className="focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          <KeyRound size={16} /> Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          required
          placeholder="At least 6 characters"
          className="focus:border-teal-500 focus:ring-teal-500"
        />
      </div>

      <Button
        type="submit"
        className={cn(
          "w-full cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-50",
          "bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700",
          "dark:bg-teal-400 dark:text-black dark:hover:bg-teal-300 dark:active:bg-teal-200",
        )}
        disabled={
          loading || !email || !password || (type === "signup" && !username)
        }
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
