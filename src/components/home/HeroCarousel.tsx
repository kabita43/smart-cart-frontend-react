
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Carousel items
const carouselItems = [
  {
    id: 1,
    title: "Summer Collection 2025",
    description: "Discover refreshing styles for the warmer days ahead.",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", 
    buttonText: "Shop Now",
    buttonLink: "/products?category=clothing",
    position: "left"
  },
  {
    id: 2,
    title: "Premium Electronics",
    description: "Upgrade your tech with the latest gadgets and innovations.",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2301&q=80",
    buttonText: "Explore",
    buttonLink: "/products?category=electronics",
    position: "right"
  },
  {
    id: 3,
    title: "Jewelry Collection",
    description: "Elegant designs that define your style and personality.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2187&q=80",
    buttonText: "View Collection",
    buttonLink: "/products?category=jewelery",
    position: "center"
  }
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto rotation
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToPrevious = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const currentItem = carouselItems[currentIndex];

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Images */}
      {carouselItems.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto h-full relative z-20 flex items-center">
        <div 
          className={cn(
            "max-w-lg text-white space-y-6 px-4 md:px-0 animate-fade-in",
            {
              "ml-auto text-right": currentItem.position === "right",
              "mx-auto text-center": currentItem.position === "center",
            }
          )}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            {currentItem.title}
          </h2>
          <p className="text-lg opacity-90">
            {currentItem.description}
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link to={currentItem.buttonLink}>
              {currentItem.buttonText}
            </Link>
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute z-30 left-4 right-4 top-1/2 -mt-8 flex justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-black/30 text-white hover:bg-black/50"
          onClick={goToPrevious}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-black/30 text-white hover:bg-black/50"
          onClick={goToNext}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute z-30 bottom-4 left-0 right-0 flex justify-center space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`h-2 transition-all ${
              currentIndex === index ? "w-8 bg-white" : "w-2 bg-white/50"
            } rounded-full`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
