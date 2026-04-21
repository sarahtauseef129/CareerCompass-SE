import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  registerUserApi,
  loginUserApi,
  storeAuthResponse,
  logoutUserApi,
} from "@/services/authApi";
import { registerUser, loginUser } from "@/services/storageService";
import { getErrorMessage, isApiValidationError } from "@/services/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Compass, Loader2 } from "lucide-react";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(searchParams.get("mode") === "login");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Try backend first
        try {
          const response = await loginUserApi(email.trim(), password);
          const user = storeAuthResponse(response);
          toast.success(`Welcome back, ${user.name}!`);
          navigate("/assessment");
          return;
        } catch (error) {
          // If it's an API validation error, don't fall back to localStorage
          if (isApiValidationError(error)) {
            toast.error(getErrorMessage(error));
            setIsLoading(false);
            return;
          }

          // Only fall back to localStorage for network errors
          try {
            const user = loginUser(email.trim(), password);
            if (user) {
              toast.success(`Welcome back, ${user.name}!`);
              navigate("/assessment");
              return;
            } else {
              toast.error("Invalid email or password");
            }
          } catch {
            toast.error(getErrorMessage(error));
          }
          setIsLoading(false);
        }
      } else {
        if (!name.trim()) {
          toast.error("Please enter your name");
          setIsLoading(false);
          return;
        }

        // Try backend first
        try {
          const response = await registerUserApi(email.trim(), password, name.trim());
          storeAuthResponse(response);
          toast.success("Account created successfully! Please sign in.");
          setPassword("");
          setEmail("");
          setName("");
          setIsLogin(true);
          navigate("/auth?mode=login");
          return;
        } catch (error) {
          // If it's an API validation error, don't fall back to localStorage
          if (isApiValidationError(error)) {
            toast.error(getErrorMessage(error));
            setIsLoading(false);
            return;
          }

          // Only fall back to localStorage for network errors
          try {
            const user = registerUser(email.trim(), password, name.trim());
            if (user) {
              toast.success("Account created successfully! Please sign in.");
              setPassword("");
              setName("");
              setIsLogin(true);
              navigate("/auth?mode=login");
              return;
            }
          } catch {
            toast.error(getErrorMessage(error));
          }
          setIsLoading(false);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Compass className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLogin
                ? "Sign in to access your career assessments"
                : "Start your career exploration journey"}
            </p>
          </div>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      disabled={isLoading}
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
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : (
                    <>{isLogin ? "Sign In" : "Create Account"}</>
                  )}
                </Button>
              </form>

              <div className="text-center mt-4">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:underline"
                  disabled={isLoading}
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}