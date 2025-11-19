import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="group hover:shadow-medium transition-base border-2 hover:border-primary">
      <CardContent className="p-6">
        <div className="w-12 h-12 rounded-lg gradient-forest flex items-center justify-center mb-4 group-hover:scale-110 transition-base">
          <Icon className="text-primary-foreground" size={24} />
        </div>
        <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
