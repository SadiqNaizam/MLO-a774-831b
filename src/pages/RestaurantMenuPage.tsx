import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DishCard, { DishItem } from '@/components/DishCard';

// Shadcn/ui Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast'; // For add to cart confirmation

// Lucide Icons
import { Star, Clock, MapPin, ShoppingBag, Utensils, Salad, Cookie, Coffee, Plus, Minus, ChefHat } from 'lucide-react';

// Interfaces for page data
interface RestaurantData {
  slug: string;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string;
  address: string;
  description: string;
  menuCategories: MenuCategory[];
}

interface MenuCategory {
  id: string;
  name: string;
  icon?: React.ElementType;
  dishes: Dish[];
}

interface Dish extends DishItem { // Extends DishItem for DishCard props
  imageUrl: string;
  description: string;
  dietaryTags?: string[];
  isAvailable?: boolean;
  customizationOptions?: { // Basic customization example
    size?: string[];
    spiceLevel?: string[];
  };
}

// Placeholder data for a restaurant
const mockRestaurantData: RestaurantData = {
  slug: 'the-gourmet-place',
  name: 'The Gourmet Place',
  imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
  cuisineTypes: ['Modern European', 'Fine Dining', 'Local Ingredients'],
  rating: 4.7,
  deliveryTime: '30-45 min',
  address: '123 Foodie Lane, Flavor Town, FT 54321',
  description: 'Experience exquisite modern European cuisine crafted with the freshest local ingredients. A culinary journey awaits you at The Gourmet Place, where every dish tells a story of flavor and passion.',
  menuCategories: [
    {
      id: 'appetizers',
      name: 'Appetizers',
      icon: Utensils,
      dishes: [
        { id: 'dish1', name: 'Seared Scallops', price: 18.50, imageUrl: 'https://images.unsplash.com/photo-1580959375474-6572278345f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', description: 'Pan-seared jumbo scallops with a lemon-butter herb sauce.', dietaryTags: ['Gluten-Free'], isAvailable: true },
        { id: 'dish2', name: 'Caprese Skewers', price: 12.00, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', description: 'Cherry tomatoes, fresh mozzarella, and basil drizzled with balsamic glaze.', dietaryTags: ['Vegetarian', 'Gluten-Free'], isAvailable: true },
      ],
    },
    {
      id: 'main-courses',
      name: 'Main Courses',
      icon: ChefHat,
      dishes: [
        { id: 'dish3', name: 'Filet Mignon', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1608879099060-92f73d0f01dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', description: '8oz center-cut filet mignon, grilled to perfection, served with potato gratin and asparagus.', dietaryTags: ['High-Protein'], isAvailable: true },
        { id: 'dish4', name: 'Lobster Risotto', price: 28.75, imageUrl: 'https://images.unsplash.com/photo-1598515213692-5f282438d333?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', description: 'Creamy Arborio risotto with succulent lobster meat and a touch of saffron.', isAvailable: false },
        { id: 'dish5', name: 'Vegan Mushroom Bourguignon', price: 22.00, imageUrl: 'https://images.unsplash.com/photo-1607528985040-81c97f8700e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', description: 'A rich and hearty stew with mushrooms, root vegetables, and red wine, served over polenta.', dietaryTags: ['Vegan', 'Plant-Based'], isAvailable: true },
      ],
    },
    {
      id: 'desserts',
      name: 'Desserts',
      icon: Cookie,
      dishes: [
        { id: 'dish6', name: 'Chocolate Lava Cake', price: 10.50, imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', description: 'Warm dark chocolate cake with a molten chocolate center, served with vanilla ice cream.', dietaryTags: ['Vegetarian'], isAvailable: true },
      ],
    },
    {
      id: 'drinks',
      name: 'Drinks',
      icon: Coffee,
      dishes: [
        { id: 'dish7', name: 'Artisan Coffee', price: 5.00, imageUrl: 'https://images.unsplash.com/photo-1511920183353-321f1f5e599f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', description: 'Freshly brewed single-origin coffee.', dietaryTags: ['Vegan'], isAvailable: true },
        { id: 'dish8', name: 'Sparkling Elderflower Presse', price: 6.50, imageUrl: 'https://images.unsplash.com/photo-1600271823054-0aad5050512b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80', description: 'Refreshing sparkling drink with elderflower and a hint of lemon.', dietaryTags: ['Vegan', 'Non-Alcoholic'], isAvailable: true },
      ],
    },
  ],
};

const RestaurantMenuPage = () => {
  const [searchParams] = useSearchParams();
  const restaurantSlug = searchParams.get('slug'); // In a real app, fetch data based on this slug
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);

  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    console.log('RestaurantMenuPage loaded');
    // Simulate fetching data based on slug or use mock data
    // For now, we'll just use the mock data directly.
    // In a real app: if (restaurantSlug === mockRestaurantData.slug) setRestaurantData(mockRestaurantData);
    setRestaurantData(mockRestaurantData);
    console.log('Restaurant slug from URL (if any):', restaurantSlug);
  }, [restaurantSlug]);

  const handleOpenCustomizeDialog = (dish: Dish) => {
    if (!dish.isAvailable) return;
    setSelectedDish(dish);
    setQuantity(1);
    setIsCustomizeDialogOpen(true);
  };

  const handleConfirmAddToCart = () => {
    if (!selectedDish) return;
    // Logic to add to cart (e.g., update global state, API call)
    console.log(`Added ${quantity} x ${selectedDish.name} to cart.`);
    toast({
      title: "Item Added to Cart!",
      description: `${quantity} x ${selectedDish.name} successfully added.`,
      action: (
        <Link to="/cart">
          <Button variant="outline" size="sm">View Cart</Button>
        </Link>
      ),
    });
    setIsCustomizeDialogOpen(false);
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  if (!restaurantData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading restaurant details...</p> {/* Or a Skeleton loader */}
        </div>
        <Footer />
      </div>
    );
  }

  const { name, imageUrl, cuisineTypes, rating, deliveryTime, address, description, menuCategories } = restaurantData;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto py-6 px-4 md:px-6">
          {/* Restaurant Info Section */}
          <Card className="mb-8 shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <AspectRatio ratio={16 / 9} className="md:h-full">
                  <img src={imageUrl} alt={`Image of ${name}`} className="object-cover w-full h-full" />
                </AspectRatio>
              </div>
              <div className="md:w-2/3 p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-3xl font-bold tracking-tight">{name}</CardTitle>
                  <div className="flex flex-wrap gap-2 my-2">
                    {cuisineTypes.map(cuisine => (
                      <Badge key={cuisine} variant="secondary">{cuisine}</Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-3 text-sm text-muted-foreground">
                  <p>{description}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-semibold">{rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-1" />
                      <span>{deliveryTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-1" />
                    <span>{address}</span>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Menu Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <ShoppingBag className="mr-2 h-6 w-6 text-primary" /> Menu
            </h2>
            {menuCategories.length > 0 ? (
              <Tabs defaultValue={menuCategories[0].id} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap bg-muted p-1 rounded-lg mb-4">
                  {menuCategories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} className="flex-1 lg:flex-none data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      {category.icon && <category.icon className="mr-2 h-4 w-4" />}
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {menuCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {category.dishes.map((dish) => (
                        <DishCard
                          key={dish.id}
                          dish={{ id: dish.id, name: dish.name, price: dish.price }}
                          imageUrl={dish.imageUrl}
                          description={dish.description}
                          dietaryTags={dish.dietaryTags}
                          onAddClick={() => handleOpenCustomizeDialog(dish)}
                          isAvailable={dish.isAvailable}
                        />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <p className="text-muted-foreground">No menu items available at the moment. Please check back later.</p>
            )}
          </section>
        </main>
      </ScrollArea>

      {/* Customization Dialog */}
      {selectedDish && (
        <Dialog open={isCustomizeDialogOpen} onOpenChange={setIsCustomizeDialogOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Customize Your Order</DialogTitle>
              {/* <DialogDescription>Adjust quantity for {selectedDish.name}.</DialogDescription> */}
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-4">
                <img src={selectedDish.imageUrl} alt={selectedDish.name} className="w-24 h-24 object-cover rounded-md"/>
                <div>
                  <h3 className="text-lg font-semibold">{selectedDish.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{selectedDish.description}</p>
                  <p className="text-lg font-bold mt-1">${selectedDish.price.toFixed(2)}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-base">Quantity</Label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    readOnly // Or onChange for direct input, but buttons are common
                    className="w-16 text-center"
                    min="1"
                  />
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Future: Add more customization options here e.g., radio groups, checkboxes */}
            </div>

            <DialogFooter className="sm:justify-between gap-2">
               <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleConfirmAddToCart} className="w-full sm:w-auto">
                Add {quantity} to Cart (${(selectedDish.price * quantity).toFixed(2)})
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
};

export default RestaurantMenuPage;