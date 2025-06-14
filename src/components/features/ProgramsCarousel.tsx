
import { Users } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface Program {
  image: string;
  title: string;
  description: string;
}

const ProgramsCarousel = () => {
  const culinaryPrograms: Program[] = [
    {
      image: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png",
      title: "Teen Chef Mastery",
      description: "Specialized program for young culinary enthusiasts aged 16-19, covering fundamental techniques to advanced plating."
    },
    {
      image: "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png",
      title: "Millennial Kitchen",
      description: "Perfect for busy professionals who want to create restaurant-quality meals at home with efficient techniques."
    },
    {
      image: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png",
      title: "Artisan Baking Club",
      description: "Master the art of bread making, pastries, and desserts with our specialized baking community and expert instructors."
    }
  ];

  return (
    <div className="mb-16 feature-item">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-royal-green/20 text-chef-royal-green rounded-full text-sm font-medium">
          <Users className="w-4 h-4" />
          Specialized Programs
        </div>
        <h3 className="text-3xl md:text-4xl font-bold mb-4 text-chef-charcoal font-playfair">
          Programs Tailored to Your Journey
        </h3>
        <p className="text-chef-charcoal/70 max-w-3xl mx-auto font-inter">
          Whether you're a teen culinary enthusiast or a busy professional, we have specialized programs designed to meet you where you are in your culinary journey.
        </p>
      </div>
      
      <div className="rounded-xl overflow-hidden bg-chef-warm-ivory p-6">
        <Carousel className="w-full max-w-7xl mx-auto">
          <CarouselContent className="flex">
            {culinaryPrograms.map((program, index) => (
              <CarouselItem key={index} className="md:basis-1/3 flex-shrink-0 bg-chef-cream">
                <Card className="chef-card border-chef-gold/20">
                  <CardContent className="p-0">
                    <div className="w-full h-48">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 bg-chef-cream">
                      <h4 className="font-bold text-xl mb-3 text-chef-charcoal font-playfair">{program.title}</h4>
                      <p className="text-chef-charcoal/70 font-inter">{program.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-4">
            <CarouselPrevious className="chef-button-outline text-black bg-chef-cream" />
            <CarouselNext className="chef-button-outline bg-chef-cream" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default ProgramsCarousel;
