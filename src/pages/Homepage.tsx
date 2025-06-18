import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CuisineSelectorPills from '@/components/CuisineSelectorPills';
import PromoBanner from '@/components/PromoBanner';
import RestaurantCard from '@/components/RestaurantCard';

// shadcn/ui Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Icons
import { Search as SearchIcon } from 'lucide-react'; // Renamed to avoid conflict with potential 'Search' component

const cuisinesList = ['Pizza', 'Burgers', 'Sushi', 'Mexican', 'Italian', 'Chinese', 'Indian', 'Vegan', 'Desserts', 'Breakfast'];

const sampleRestaurants = [
  {
    id: '1',
    slug: 'pizza-palace-downtown',
    name: 'Pizza Palace Downtown',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
    cuisineTypes: ['Italian', 'Pizza', 'Pasta'],
    rating: 4.7,
    deliveryTime: '25-35 min',
    promotionTag: '20% Off',
  },
  {
    id: '2',
    slug: 'the-burger-joint',
    name: 'The Burger Joint',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
    cuisineTypes: ['American', 'Burgers', 'Fries'],
    rating: 4.5,
    deliveryTime: '20-30 min',
  },
  {
    id: '3',
    slug: 'sushi-heaven',
    name: 'Sushi Heaven',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
    cuisineTypes: ['Japanese', 'Sushi', 'Seafood'],
    rating: 4.9,
    deliveryTime: '30-40 min',
    promotionTag: 'Free Edamame',
  },
  {
    id: '4',
    slug: 'el-taco-loco',
    name: 'El Taco Loco',
    imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80',
    cuisineTypes: ['Mexican', 'Tacos', 'Burritos'],
    rating: 4.4,
    deliveryTime: '25-35 min',
  },
];

const Homepage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  console.log('Homepage loaded');

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let queryString = '';
    if (searchQuery.trim()) {
      queryString += `search=${encodeURIComponent(searchQuery.trim())}`;
    }
    if (selectedCuisine) {
      queryString += `${queryString ? '&' : ''}cuisine=${encodeURIComponent(selectedCuisine)}`;
    }
    navigate(`/restaurant-listing${queryString ? `?${queryString}` : ''}`);
  };
  
  const handleCuisineChange = (cuisine: string | undefined) => {
    setSelectedCuisine(cuisine);
    // Optionally, trigger navigation immediately or wait for search submit
    // For now, we just update state. Search submit will use it.
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <ScrollArea className="flex-1">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Search Section */}
          <section className="py-10 md:py-16 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Your Next Meal, <span className="text-primary">Delivered</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover top-rated local restaurants and enjoy your favorite food delivered to your doorstep.
            </p>
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3"
            >
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants, cuisines, or dishes..."
                className="h-12 text-base flex-grow w-full sm:w-auto shadow-sm focus:ring-2 focus:ring-primary"
                aria-label="Search for food or restaurants"
              />
              <Button type="submit" size="lg" className="h-12 w-full sm:w-auto shadow-sm">
                <SearchIcon className="h-5 w-5 mr-2" />
                Search
              </Button>
            </form>
          </section>

          {/* Cuisine Selector Pills */}
          <section className="py-6 md:py-8">
            <h2 className="text-2xl font-semibold mb-4 text-center md:text-left text-gray-800 dark:text-gray-200">
              Explore by Cuisine
            </h2>
            <CuisineSelectorPills
              cuisines={cuisinesList}
              selectedCuisine={selectedCuisine}
              onCuisineChange={handleCuisineChange}
            />
          </section>

          {/* Promotional Banner */}
          <section className="py-6 md:py-8">
            <PromoBanner /> {/* Uses default items from the component */}
          </section>

          {/* Featured Restaurants Section */}
          <section className="py-6 md:py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Featured Restaurants
              </h2>
              <Button variant="link" onClick={() => navigate('/restaurant-listing')} className="text-primary">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  id={restaurant.id}
                  slug={restaurant.slug}
                  imageUrl={restaurant.imageUrl}
                  name={restaurant.name}
                  cuisineTypes={restaurant.cuisineTypes}
                  rating={restaurant.rating}
                  deliveryTime={restaurant.deliveryTime}
                  promotionTag={restaurant.promotionTag}
                />
              ))}
            </div>
          </section>
          
          {/* Consider adding another section like "Popular Near You" or "New on FoodieApp" if more content is desired */}
          {/* Example:
          <section className="py-6 md:py-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Popular Near You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleRestaurants.slice(0,4).reverse().map((restaurant) => ( // Example of different data/order
                <RestaurantCard
                  key={restaurant.id + '-popular'} // Ensure unique key
                  id={restaurant.id}
                  slug={restaurant.slug}
                  imageUrl={restaurant.imageUrl}
                  name={restaurant.name}
                  cuisineTypes={restaurant.cuisineTypes}
                  rating={restaurant.rating}
                  deliveryTime={restaurant.deliveryTime}
                />
              ))}
            </div>
          </section>
          */}

        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
};

export default Homepage;