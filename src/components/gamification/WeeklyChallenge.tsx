
import { useState } from "react";
import { Trophy, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChallengeModal from "../challenges/ChallengeModal";

const WeeklyChallenge = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="border border-chef-charcoal/10 bg-gradient-to-br from-chef-warm-ivory to-chef-warm-ivory/95 hover:shadow-chef-luxury transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-chef-gold/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-chef-gold" />
            </div>
            <CardTitle className="text-lg font-playfair text-chef-charcoal">
              Daily Challenges
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-chef-charcoal/70">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">24 Hours • 3 Days • Weekly</span>
            </div>
            
            <div className="flex items-center gap-2 text-chef-charcoal/70">
              <Target className="w-4 h-4" />
              <span className="text-sm">Upload recipes, ask questions, complete courses</span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-chef-charcoal/80 mb-4">
              Join cooking challenges to earn XP, unlock achievements, and level up your culinary skills!
            </p>
            
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-chef-gold hover:bg-chef-gold/90 text-chef-charcoal font-medium"
            >
              Join Challenges
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChallengeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default WeeklyChallenge;
