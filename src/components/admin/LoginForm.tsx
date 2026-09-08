import { useState } from "react";
import { Lock, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STORE_NAME } from "@/lib/site";

interface LoginFormProps {
  onSignIn: (email: string, password: string) => Promise<boolean>;
  signingIn: boolean;
  error: string | null;
}

export function LoginForm({ onSignIn, signingIn, error }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const podeEnviar = email.trim() !== "" && password !== "" && !signingIn;

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (podeEnviar) void onSignIn(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={enviar} className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-4 w-4 text-primary" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-card-foreground">Painel de controle</h1>
              <p className="text-xs text-muted-foreground">{STORE_NAME}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                inputMode="email"
                placeholder="seu@email.com"
                className="h-12"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="h-12"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-2.5 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" disabled={!podeEnviar} size="lg" className="mt-5 h-12 w-full gap-2">
            <LogIn className="h-4 w-4" />
            {signingIn ? "Entrando..." : "Entrar"}
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Área restrita. O cardápio fica em{" "}
          <a href="/" className="font-medium text-foreground underline underline-offset-2">
            papaleguas
          </a>
          .
        </p>
      </form>
    </div>
  );
}
