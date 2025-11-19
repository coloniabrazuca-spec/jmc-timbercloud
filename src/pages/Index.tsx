import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Link } from "react-router-dom";
import {
  Database,
  Truck,
  Package,
  ShoppingCart,
  BarChart3,
  Shield,
  Zap,
  Users,
} from "lucide-react";
import heroImage from "@/assets/hero-sawmill.jpg";
import featureDashboard from "@/assets/feature-dashboard.jpg";
import featureProduction from "@/assets/feature-production.jpg";
import featureLogistics from "@/assets/feature-logistics.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 container mx-auto px-4 text-primary-foreground">
          <h1 className="font-display font-extrabold text-5xl md:text-7xl mb-6 drop-shadow-lg">
            JMC TimberCloud
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            Gestão Inteligente para Serrarias e Produção de Pallets
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto drop-shadow-md opacity-90">
            Controle madeira, produção, fornecedores e vendas em um único lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-strong text-lg px-8"
              asChild
            >
              <Link to="/auth?mode=signup">Criar Conta Grátis</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-background/90 hover:bg-background text-foreground border-2 text-lg px-8"
              asChild
            >
              <Link to="/auth">Entrar</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar sua serraria de forma profissional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Database}
              title="Controle de Estoque"
              description="Gerencie todo seu estoque de madeira em tempo real com alertas inteligentes"
            />
            <FeatureCard
              icon={Truck}
              title="Gestão de Caminhões"
              description="Registre entregas, fornecedores e controle toda a logística de entrada"
            />
            <FeatureCard
              icon={Package}
              title="Produção de Paletes"
              description="Monitore a produção diária e o consumo de madeira por tipo de palete"
            />
            <FeatureCard
              icon={ShoppingCart}
              title="Controle de Vendas"
              description="Gerencie clientes, pedidos e acompanhe pagamentos de forma simples"
            />
            <FeatureCard
              icon={BarChart3}
              title="Relatórios Avançados"
              description="Visualize dados em tempo real com gráficos e exporte em PDF/Excel"
            />
            <FeatureCard
              icon={Shield}
              title="Segurança Total"
              description="Seus dados protegidos com criptografia e backups automáticos"
            />
            <FeatureCard
              icon={Zap}
              title="Rápido e Eficiente"
              description="Interface moderna e responsiva que funciona em qualquer dispositivo"
            />
            <FeatureCard
              icon={Users}
              title="Multi-usuários"
              description="Adicione sua equipe e controle permissões de acesso"
            />
          </div>
        </div>
      </section>

      {/* Visual Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="font-display font-bold text-3xl md:text-4xl mb-6">
                Dashboard Completo e Intuitivo
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Visualize todas as informações importantes em um único lugar. Acompanhe estoque,
                produção, vendas e muito mais com gráficos e métricas em tempo real.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Métricas de produção em tempo real</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Alertas automáticos de estoque baixo</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Histórico completo de operações</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg overflow-hidden shadow-strong">
              <img
                src={featureDashboard}
                alt="Dashboard"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-lg overflow-hidden shadow-strong">
              <img
                src={featureProduction}
                alt="Produção"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="font-display font-bold text-3xl md:text-4xl mb-6">
                Controle Total da Produção
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Gerencie a produção de paletes com precisão. Registre medidas, consumo de madeira e
                acompanhe a eficiência da sua operação.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Registro rápido de paletes produzidos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Cálculo automático de consumo de madeira</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>Relatórios de eficiência por período</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
              Por Que Escolher o TimberCloud?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transforme a gestão da sua serraria com tecnologia de ponta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full gradient-forest flex items-center justify-center mx-auto mb-4">
                <Zap className="text-primary-foreground" size={32} />
              </div>
              <h3 className="font-display font-semibold text-2xl mb-3">Economize Tempo</h3>
              <p className="text-muted-foreground">
                Reduza tarefas manuais em até 80% com automação inteligente e processos otimizados
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full gradient-cedar flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-secondary-foreground" size={32} />
              </div>
              <h3 className="font-display font-semibold text-2xl mb-3">Aumente Lucros</h3>
              <p className="text-muted-foreground">
                Tome decisões baseadas em dados reais e aumente sua margem de lucro
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <Shield className="text-accent-foreground" size={32} />
              </div>
              <h3 className="font-display font-semibold text-2xl mb-3">Total Segurança</h3>
              <p className="text-muted-foreground">
                Seus dados protegidos com a mais alta tecnologia de segurança e criptografia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
              O Que Dizem Nossos Clientes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Serrarias que já transformaram sua gestão com o TimberCloud
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Carlos Silva"
              role="Proprietário"
              company="Serraria Silva & Filhos"
              content="Antes levávamos horas para controlar o estoque. Agora é tudo automático e em tempo real. Revolucionou nosso negócio!"
              rating={5}
            />
            <TestimonialCard
              name="Marina Santos"
              role="Gerente de Produção"
              company="MadeiraTech Paletes"
              content="A visibilidade que temos agora da produção é incrível. Conseguimos aumentar nossa eficiência em 40% no primeiro mês."
              rating={5}
            />
            <TestimonialCard
              name="Roberto Lima"
              role="Diretor Comercial"
              company="Pallets Premium"
              content="Os relatórios detalhados nos ajudaram a identificar gargalos e otimizar processos. Recomendo fortemente!"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Pronto Para Transformar Sua Serraria?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Comece hoje mesmo e veja como é fácil gerenciar sua produção de forma profissional
          </p>
          <Button
            size="lg"
            className="bg-background text-foreground hover:bg-background/90 shadow-strong text-lg px-8"
            asChild
          >
            <Link to="/auth?mode=signup">Criar Conta Grátis Agora</Link>
          </Button>
          <p className="text-sm mt-4 opacity-75">Sem cartão de crédito • Configuração em minutos</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
