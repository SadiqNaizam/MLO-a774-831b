import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Plus } from 'lucide-react';

export interface DishItem {
  id: string | number;
  name: string;
  price: number;
}

interface DishCardProps {
  dish: DishItem;
  imageUrl: string;
  description: string;
  dietaryTags?: string[];
  onAddClick: (dish: DishItem) => void;
  isAvailable?: boolean; // Defaults to true
}

const DishCard: React.FC<DishCardProps> = ({
  dish,
  imageUrl,
  description,
  dietaryTags = [],
  onAddClick,
  isAvailable = true,
}) => {
  console.log(`DishCard loaded for: ${dish.name}`);

  const handleAdd = () => {
    if (isAvailable) {
      onAddClick(dish);
    }
  };

  return (
    <Card className="w-full overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={4 / 3}>
          <img
            src={imageUrl || `https://via.placeholder.com/400x300?text=${encodeURIComponent(dish.name)}`}
            alt={dish.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        {!isAvailable && (
          <Badge variant="destructive" className="absolute top-2 right-2 z-10">
            Unavailable
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-2 flex-grow">
        <h3 className="text-lg font-semibold tracking-tight">{dish.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 h-[3.75rem]"> {/* Approx 3 lines height */}
          {description}
        </p>
        {dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {dietaryTags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-2 border-t"> {/* Adjusted padding top */}
        <div className="flex justify-between items-center w-full">
          <p className="text-xl font-bold text-foreground">
            ${dish.price.toFixed(2)}
          </p>
          <Button onClick={handleAdd} disabled={!isAvailable} size="default">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DishCard;