import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-strong">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-lg gradient-forest flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-2xl">J</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-display">
            {isSignUp ? "Criar Conta" : "Entrar"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Preencha os dados abaixo para criar sua conta"
              : "Entre com suas credenciais para acessar o sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" placeholder="João Silva" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" />
            </div>
          )}
          <Button className="w-full gradient-forest" size="lg">
            {isSignUp ? "Criar Conta" : "Entrar"}
          </Button>
          <div className="text-center text-sm">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline transition-fast"
            >
              {isSignUp ? "Já tem uma conta? Entre aqui" : "Não tem conta? Crie uma agora"}
            </button>
          </div>
          {!isSignUp && (
            <div className="text-center text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-fast">
                Esqueceu sua senha?
              </a>
            </div>
          )}
          <div className="text-center pt-4 border-t border-border">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-fast">
              ← Voltar para o site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
