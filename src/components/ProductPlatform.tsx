
import { motion } from "framer-motion";
import { ChefHat, Users, BookOpen, Award, CalendarDays, Utensils, Star, Shield, Play, MessageCircle, FileText, Bookmark } from 'lucide-react';

const platformColumns = [
  {
    title: "Community & Clubs",
    subtitle: "Connect & Share",
    features: [
      { icon: <Users className="text-chef-royal-blue w-5 h-5" />, text: "Member-only Clubs" },
      { icon: <MessageCircle className="text-chef-gold w-5 h-5" />, text: "Chats & Challenges" },
      { icon: <Star className="text-chef-gold w-5 h-5" />, text: "Leaderboards" }
    ],
    description: "An exclusive social space for passionate chefs and foodies to connect, share, and compete together.",
    bg: "bg-chef-royal-blue/10"
  },
  {
    title: "Culinary Learning Hub",
    subtitle: "Cook & Grow",
    features: [
      { icon: <ChefHat className="text-chef-royal-green w-5 h-5" />, text: "Live Cook-Alongs" },
      { icon: <BookOpen className="text-chef-royal-blue w-5 h-5" />, text: "Masterclass Library" },
      { icon: <Play className="text-chef-gold w-5 h-5" />, text: "On-Demand Tutorials" },
      { icon: <FileText className="text-chef-royal-green w-5 h-5" />, text: "Step-by-Step Recipes" },
    ],
    description: "Access live cooking events, expert-led classes, on-demand video lessons, and an ever-growing recipe vault.",
    bg: "bg-chef-royal-green/10"
  },
  {
    title: "Membership Benefits",
    subtitle: "Enjoy & Elevate",
    features: [
      { icon: <Award className="text-chef-gold w-5 h-5" />, text: "Skill Certification" },
      { icon: <Bookmark className="text-chef-royal-blue w-5 h-5" />, text: "Curated Collections" },
      { icon: <Utensils className="text-chef-royal-green w-5 h-5" />, text: "Exclusive Events" },
      { icon: <CalendarDays className="text-chef-gold w-5 h-5" />, text: "Monthly Challenges" },
      { icon: <Shield className="text-chef-royal-blue w-5 h-5" />, text: "VIP Access" }
    ],
    description: "Unlock courses, exclusive events, curated ingredient boxes, and member-only rewards.",
    bg: "bg-chef-gold/10"
  }
];

const ProductPlatform = () => {
  return (
    <div className="w-full relative">
      {/* ChefsCircle Platform Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-playfair text-chef-royal-blue">
          The ChefsCircle Experience
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-chef-charcoal/80 max-w-4xl">
          ChefsCircle brings together a vibrant community, world-class learning, and member-only experiences in an exclusive online club for food lovers. Discover premium benefits, interactive culinary events, and resources crafted for aspiring chefs and enthusiastic home cooks.
        </p>
      </motion.div>

      {/* ChefsCircle Platform - Three Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {platformColumns.map((col, idx) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * idx }}
            className="flex-1"
          >
            <div className={`rounded-xl p-4 sm:p-6 h-full shadow-md border border-chef-royal-blue/10 ${col.bg}`}>
              <h3 className="text-lg sm:text-xl font-bold text-center mb-1 font-playfair text-chef-charcoal">{col.title}</h3>
              <p className="text-xs sm:text-sm text-center mb-4 text-chef-royal-blue/75">{col.subtitle}</p>
              
              <div className="space-y-3 mb-6">
                {col.features.map((item, i) => (
                  <div key={i} className="bg-white/90 rounded-lg p-3 sm:p-4 flex items-center shadow-xs">
                    <div className="mr-3 sm:mr-4 flex-shrink-0">{item.icon}</div>
                    <span className="text-chef-charcoal/90 font-medium text-xs sm:text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-xs sm:text-sm text-center mt-2 sm:mt-4 text-chef-charcoal/80">
                {col.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductPlatform;
