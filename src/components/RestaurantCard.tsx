import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  id: string | number;
  slug: string;
  imageUrl: string;
  name: string;
  cuisineTypes: string[];
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "25-35 min"
  promotionTag?: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  slug,
  imageUrl,
  name,
  cuisineTypes,
  rating,
  deliveryTime,
  promotionTag,
}) => {
  console.log('RestaurantCard loaded for:', name);

  const placeholderImage = 'https://via.placeholder.com/400x300?text=Restaurant';

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg group flex flex-col h-full">
      <Link to={`/restaurant-menu?slug=${slug}`} className="flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || placeholderImage}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          {promotionTag && (
            <Badge 
              variant="destructive" 
              className="absolute top-2 right-2 z-10 text-xs px-2 py-1"
            >
              {promotionTag}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-4 space-y-2 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold truncate group-hover:text-primary" title={name}>
              {name}
            </h3>
            
            <div className="flex flex-wrap gap-1 my-2">
              {cuisineTypes.slice(0, 3).map((cuisine) => ( // Limit to 3 for space
                <Badge key={cuisine} variant="outline" className="text-xs">
                  {cuisine}
                </Badge>
              ))}
              {cuisineTypes.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{cuisineTypes.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t mt-auto">
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{deliveryTime}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default RestaurantCard;