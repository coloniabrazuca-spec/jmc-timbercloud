import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded gradient-forest flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">J</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              JMC Madeira
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-foreground hover:text-primary transition-fast">
              Funcionalidades
            </Link>
            <Link to="/#benefits" className="text-foreground hover:text-primary transition-fast">
              Benefícios
            </Link>
            <Link to="/#testimonials" className="text-foreground hover:text-primary transition-fast">
              Depoimentos
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button className="gradient-forest" asChild>
              <Link to="/auth?mode=signup">Criar Conta</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link
                to="/#features"
                className="text-foreground hover:text-primary transition-fast"
                onClick={() => setIsMenuOpen(false)}
              >
                Funcionalidades
              </Link>
              <Link
                to="/#benefits"
                className="text-foreground hover:text-primary transition-fast"
                onClick={() => setIsMenuOpen(false)}
              >
                Benefícios
              </Link>
              <Link
                to="/#testimonials"
                className="text-foreground hover:text-primary transition-fast"
                onClick={() => setIsMenuOpen(false)}
              >
                Depoimentos
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button variant="outline" asChild>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    Entrar
                  </Link>
                </Button>
                <Button className="gradient-forest" asChild>
                  <Link to="/auth?mode=signup" onClick={() => setIsMenuOpen(false)}>
                    Criar Conta
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
