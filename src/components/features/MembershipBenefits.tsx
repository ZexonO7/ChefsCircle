
import { Star, Trophy, Heart, Utensils, Crown } from "lucide-react";

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const MembershipBenefits = () => {
  const membershipBenefits: Benefit[] = [
    {
      icon: <Star className="h-8 w-8 text-chef-gold" />,
      title: "VIP Access",
      description: "First access to new classes and exclusive chef events"
    },
    {
      icon: <Trophy className="h-8 w-8 text-chef-gold" />,
      title: "Skill Certification",
      description: "Earn recognized certificates for completed masterclasses"
    },
    {
      icon: <Heart className="h-8 w-8 text-chef-gold" />,
      title: "Personal Growth",
      description: "Track your culinary journey with personalized progress reports"
    },
    {
      icon: <Utensils className="h-8 w-8 text-chef-gold" />,
      title: "Premium Tools",
      description: "Access to exclusive recipe collections and meal planning tools"
    }
  ];

  return (
    <div className="feature-item chef-gradient-blue rounded-2xl p-8 md:p-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-gold/20 text-chef-gold rounded-full text-sm font-medium">
          <Crown className="w-4 h-4" />
          Premium Culinary Experience
        </div>
        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-chef-warm-ivory font-playfair">
          Why Choose ChefCircle?
        </h3>
        <p className="text-chef-warm-ivory/90 max-w-2xl mx-auto font-inter">
          Join an exclusive community of culinary enthusiasts and gain access to world-class instruction, premium content, and invaluable networking opportunities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {membershipBenefits.map((benefit, index) => (
          <div key={index} className="bg-chef-warm-ivory rounded-xl p-6 text-center chef-hover-lift border border-chef-gold/10">
            <div className="bg-chef-gold/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              {benefit.icon}
            </div>
            <h4 className="font-bold text-lg mb-2 text-chef-charcoal font-playfair">{benefit.title}</h4>
            <p className="text-chef-charcoal/70 text-sm font-inter">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipBenefits;
