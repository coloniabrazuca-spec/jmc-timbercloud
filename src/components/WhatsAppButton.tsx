import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  fixed?: boolean;
}

export const WhatsAppButton = ({ fixed = false }: WhatsAppButtonProps) => {
  const phoneNumber = "5515998716029";
  const message = "Olá, preciso de suporte no sistema JMC Madeira.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  if (fixed) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-strong transition-base"
        aria-label="Suporte WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    );
  }

  return (
    <Button
      asChild
      variant="outline"
      className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="mr-2 h-4 w-4" />
        Suporte WhatsApp
      </a>
    </Button>
  );
};
