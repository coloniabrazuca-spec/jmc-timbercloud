import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export const TestimonialCard = ({ name, role, company, content, rating }: TestimonialCardProps) => {
  return (
    <Card className="shadow-medium">
      <CardContent className="p-6">
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="text-yellow-500 fill-yellow-500" size={18} />
          ))}
        </div>
        <p className="text-foreground mb-6 italic">"{content}"</p>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-display font-bold text-primary text-lg">
              {name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">
              {role} • {company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
