import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PromoItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  altText?: string;
  textColor?: string; // e.g. 'text-white'
  overlayColor?: string; // e.g. 'bg-black/50'
}

// Sensible defaults for promo items using more appealing image placeholders
const defaultPromoItems: PromoItem[] = [
  {
    id: "promo1",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=450&q=80",
    title: "Weekend Feast Special!",
    description: "Get 20% off on all orders above $50 this weekend. Explore delicious options now!",
    ctaText: "Order Now",
    ctaLink: "/restaurant-listing", // Valid route from App.tsx
    altText: "Delicious food platter with various dishes",
    textColor: "text-white",
    overlayColor: "bg-black/60",
  },
  {
    id: "promo2",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=450&q=80",
    title: "Featured: 'Bella Italia Pizzeria'",
    description: "Authentic Italian pizzas and pastas. Click to see their mouth-watering menu.",
    ctaText: "View Menu",
    ctaLink: "/restaurant-menu?restaurantId=bella-italia", // Query params are handled by the page
    altText: "Close-up of a freshly baked pizza",
    textColor: "text-white",
    overlayColor: "bg-black/50",
  },
  {
    id: "promo3",
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=450&q=80",
    title: "Free Delivery Fridays!",
    description: "Enjoy free delivery on all your favorite meals every Friday. Don't miss out!",
    ctaText: "Explore Restaurants",
    ctaLink: "/restaurant-listing", // Valid route
    altText: "Juicy burger with fries",
    textColor: "text-white",
    overlayColor: "bg-black/70",
  },
];

interface PromoBannerProps {
  items?: PromoItem[];
}

const PromoBanner: React.FC<PromoBannerProps> = ({ items = defaultPromoItems }) => {
  console.log('PromoBanner loaded');

  if (!items || items.length === 0) {
    return (
      <div className="w-full py-8 text-center text-gray-500 bg-gray-100 rounded-lg">
        <p className="text-lg">No promotions available at the moment.</p>
        <p className="text-sm">Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="w-full py-4 md:py-6">
      <Carousel
        className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
        opts={{
          loop: items.length > 1,
          align: "start",
        }}
      >
        <CarouselContent className="-ml-4"> {/* Default margin adjustment for shadcn/ui Carousel */}
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-4 md:basis-1/1"> {/* Default padding adjustment */}
              <Card className="overflow-hidden rounded-lg shadow-xl group">
                <CardContent className="relative flex aspect-[16/7] md:aspect-[16/6] items-center justify-center p-0">
                  <img
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 md:p-8 ${item.overlayColor || 'bg-black/50'} transition-opacity duration-300 group-hover:bg-opacity-70`}
                  >
                    <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${item.textColor || 'text-white'} mb-2 md:mb-4 drop-shadow-lg`}>
                      {item.title}
                    </h2>
                    <p className={`text-xs sm:text-sm md:text-base ${item.textColor || 'text-white'} opacity-90 mb-3 md:mb-6 max-w-xs md:max-w-md lg:max-w-lg drop-shadow-md`}>
                      {item.description}
                    </p>
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold px-6 py-3 rounded-md transition-all transform group-hover:scale-105">
                      <Link to={item.ctaLink}>{item.ctaText}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {items.length > 1 && (
          <>
            <div className="hidden md:block"> {/* Show arrows on larger screens */}
                <CarouselPrevious className="absolute left-0 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-800 h-8 w-8 sm:h-10 sm:w-10 rounded-full shadow-md" />
                <CarouselNext className="absolute right-0 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-gray-800 h-8 w-8 sm:h-10 sm:w-10 rounded-full shadow-md" />
            </div>
          </>
        )}
      </Carousel>
    </div>
  );
};

export default PromoBanner;