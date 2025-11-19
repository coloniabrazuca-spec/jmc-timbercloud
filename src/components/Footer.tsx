import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded gradient-forest flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">J</span>
              </div>
              <span className="font-display font-bold text-lg">JMC Madeira</span>
            </div>
            <p className="text-sm text-accent-foreground/80">
              Gestão inteligente para serrarias e produção de pallets.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/#features" className="hover:text-primary transition-fast">
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link to="/#benefits" className="hover:text-primary transition-fast">
                  Benefícios
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary transition-fast">
                  Entrar
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition-fast">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-fast">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-fast">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-primary" />
                <span>contato@jmctimber.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-primary" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} className="text-primary" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-accent-foreground/20 mt-8 pt-8 text-center text-sm text-accent-foreground/60">
          <p>&copy; 2025 JMC Madeira. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
