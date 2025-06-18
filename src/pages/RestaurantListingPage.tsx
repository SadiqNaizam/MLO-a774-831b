import React, { useState, useEffect, useMemo } from 'react';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RestaurantCardComponent from '@/components/RestaurantCard'; // Renamed to avoid conflict with potential type

// Shadcn/UI Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Icons
import { Search as SearchIcon, RotateCcw } from 'lucide-react';

interface Restaurant {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string; // e.g., "25-35 min"
  promotionTag?: string;
  isOpenNow: boolean;
  hasFreeDelivery: boolean;
}

const sampleRestaurants: Restaurant[] = [
  { id: '1', slug: 'pizza-paradise', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', name: 'Pizza Paradise', cuisineTypes: ['Pizza', 'Italian'], rating: 4.5, deliveryTime: '25-35 min', promotionTag: '20% OFF', isOpenNow: true, hasFreeDelivery: false },
  { id: '2', slug: 'sushi-central', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', name: 'Sushi Central', cuisineTypes: ['Sushi', 'Japanese'], rating: 4.8, deliveryTime: '30-40 min', isOpenNow: false, hasFreeDelivery: true },
  { id: '3', slug: 'burger-bliss', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', name: 'Burger Bliss', cuisineTypes: ['Burgers', 'American', 'Fast Food'], rating: 4.2, deliveryTime: '20-30 min', promotionTag: 'Free Fries', isOpenNow: true, hasFreeDelivery: true },
  { id: '4', slug: 'taco-town', imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', name: 'Taco Town', cuisineTypes: ['Mexican', 'Tacos'], rating: 4.6, deliveryTime: '25-35 min', isOpenNow: true, hasFreeDelivery: false },
  { id: '5', slug: 'curry-corner', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a058387cc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', name: 'Curry Corner', cuisineTypes: ['Indian', 'Curry'], rating: 4.7, deliveryTime: '35-45 min', promotionTag: 'Family Deal', isOpenNow: false, hasFreeDelivery: false },
  { id: '6', slug: 'pasta-place', imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', name: 'Pasta Place', cuisineTypes: ['Italian', 'Pasta'], rating: 4.3, deliveryTime: '30-40 min', isOpenNow: true, hasFreeDelivery: true },
  { id: '7', slug: 'healthy-habits', imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', name: 'Healthy Habits', cuisineTypes: ['Salads', 'Healthy', 'Smoothies'], rating: 4.9, deliveryTime: '15-25 min', isOpenNow: true, hasFreeDelivery: false },
  { id: '8', slug: 'dragon-wok', imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', name: 'Dragon Wok', cuisineTypes: ['Chinese', 'Asian'], rating: 4.1, deliveryTime: '30-40 min', promotionTag: 'Lunch Special', isOpenNow: false, hasFreeDelivery: true },
  { id: '9', slug: 'veg-delight', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', name: 'Veg Delight', cuisineTypes: ['Vegetarian', 'Vegan', 'Healthy'], rating: 4.4, deliveryTime: '25-30 min', isOpenNow: true, hasFreeDelivery: false },
  { id: '10', slug: 'sea-feast', imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', name: 'Sea Feast', cuisineTypes: ['Seafood', 'Grill'], rating: 4.6, deliveryTime: '40-50 min', isOpenNow: true, hasFreeDelivery: false },
];

const RESTAURANTS_PER_PAGE = 8;

const RestaurantListingPage = () => {
  console.log('RestaurantListingPage loaded');

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [filters, setFilters] = useState({
    openNow: false,
    freeDelivery: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const resetAllFilters = () => {
    setSearchTerm('');
    setSortBy('rating');
    setFilters({ openNow: false, freeDelivery: false });
    setCurrentPage(1);
  };
  
  const filteredAndSortedRestaurants = useMemo(() => {
    let processed = [...sampleRestaurants];

    if (searchTerm) {
      processed = processed.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisineTypes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.openNow) {
      processed = processed.filter(r => r.isOpenNow);
    }
    if (filters.freeDelivery) {
      processed = processed.filter(r => r.hasFreeDelivery);
    }

    switch (sortBy) {
      case 'rating':
        processed.sort((a, b) => b.rating - a.rating);
        break;
      case 'deliveryTime':
        processed.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
        break;
      case 'name':
        processed.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return processed;
  }, [searchTerm, sortBy, filters]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, sortBy, filters]);

  const totalPages = Math.ceil(filteredAndSortedRestaurants.length / RESTAURANTS_PER_PAGE);
  const currentRestaurants = filteredAndSortedRestaurants.slice(
    (currentPage - 1) * RESTAURANTS_PER_PAGE,
    currentPage * RESTAURANTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Optional: Scroll to top of results
      // window.scrollTo({ top: document.getElementById('restaurant-list-section')?.offsetTop || 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <section aria-labelledby="page-title" className="mb-6 md:mb-8">
          <h1 id="page-title" className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-white">
            Find Your Next Meal
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Explore a wide variety of restaurants and cuisines.
          </p>
        </section>

        {/* Search and Filters Section */}
        <section aria-labelledby="filters-heading" className="mb-6 md:mb-8 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-1 lg:col-span-2">
                    <Label htmlFor="search-restaurants" className="text-sm font-medium">Search</Label>
                    <div className="relative mt-1">
                        <Input
                        id="search-restaurants"
                        type="text"
                        placeholder="Restaurant name or cuisine..."
                        className="pl-10 pr-4 py-2 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>

                <div>
                    <Label htmlFor="sort-by" className="text-sm font-medium">Sort By</Label>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                        <SelectTrigger id="sort-by" className="w-full mt-1">
                        <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="deliveryTime">Delivery Time</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-end md:space-x-2 md:col-span-3 lg:col-span-1">
                    <div className="flex-grow flex items-center space-x-2 pt-3 md:pt-0">
                        <Checkbox 
                            id="filter-open-now" 
                            checked={filters.openNow}
                            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, openNow: !!checked }))}
                        />
                        <Label htmlFor="filter-open-now" className="text-sm font-medium whitespace-nowrap">Open Now</Label>
                    </div>
                    <div className="flex-grow flex items-center space-x-2 pt-3 md:pt-0">
                        <Checkbox 
                            id="filter-free-delivery"
                            checked={filters.freeDelivery}
                            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, freeDelivery: !!checked }))}
                        />
                        <Label htmlFor="filter-free-delivery" className="text-sm font-medium whitespace-nowrap">Free Delivery</Label>
                    </div>
                    <Button variant="outline" onClick={resetAllFilters} className="mt-3 md:mt-0 w-full md:w-auto" aria-label="Reset filters">
                        <RotateCcw className="h-4 w-4 md:mr-2"/>
                        <span className="hidden md:inline">Reset</span>
                    </Button>
                </div>
            </div>
        </section>


        {/* Restaurant Listing Section */}
        <section id="restaurant-list-section" aria-live="polite">
          {currentRestaurants.length > 0 ? (
            <ScrollArea className="w-full h-[calc(100vh-460px)] md:h-[calc(100vh-420px)]"> {/* Approximate height, adjust as needed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-1">
                {currentRestaurants.map((restaurant) => (
                    <RestaurantCardComponent key={restaurant.id} {...restaurant} />
                ))}
                </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-muted-foreground">No Restaurants Found</h2>
              <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </section>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <section aria-label="Pagination" className="mt-6 md:mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  // Basic logic to show limited page numbers (e.g., current, +/-2, first, last)
                  // For simplicity, this example shows all pages. Consider a more advanced pagination UI for many pages.
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantListingPage;