import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Home, Store, Bike, MapPin, Route } from 'lucide-react';

interface OrderTrackerMapProps {
  userAddress: string;
  restaurantAddress: string;
  deliveryAgentName?: string;
  deliveryStatus: 'preparing' | 'picked-up' | 'en-route' | 'arriving-soon' | 'delivered';
  estimatedTimeOfArrival: string;
  // In a real scenario, these would be coordinates for map rendering
  // userLocationCoords?: { lat: number; lng: number };
  // restaurantLocationCoords?: { lat: number; lng: number };
  // deliveryAgentCoords?: { lat: number; lng: number };
}

const OrderTrackerMap: React.FC<OrderTrackerMapProps> = ({
  userAddress,
  restaurantAddress,
  deliveryAgentName = "Your Rider",
  deliveryStatus,
  estimatedTimeOfArrival,
}) => {
  console.log('OrderTrackerMap loaded');

  // Placeholder positions for icons (percentage-based for responsiveness)
  const getAgentPosition = () => {
    switch (deliveryStatus) {
      case 'preparing':
      case 'picked-up':
        return { top: '50%', left: '15%' }; // Near restaurant
      case 'en-route':
        return { top: '50%', left: '50%' }; // Mid-way
      case 'arriving-soon':
        return { top: '50%', left: '80%' }; // Near user
      case 'delivered':
        return { top: '50%', left: '85%' }; // At user
      default:
        return { top: '50%', left: '15%' };
    }
  };

  const agentPosition = getAgentPosition();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-primary" />
          Delivery Tracker
        </CardTitle>
        <CardDescription>
          Tracking your order from "{restaurantAddress}" to "{userAddress}".
          ETA: {estimatedTimeOfArrival}. Status: {deliveryStatus.replace('-', ' ')}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={16 / 9} className="bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
          <div className="relative w-full h-full p-4">
            {/* Placeholder for Map Background */}
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 opacity-30">
              {/* Could add subtle pattern or "Map Area" text here */}
              <span className="absolute top-2 left-2 text-xs text-gray-400 dark:text-gray-500">
                Live Map Placeholder
              </span>
            </div>

            {/* Restaurant Location */}
            <div className="absolute top-[50%] left-[15%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
              <Store className="h-8 w-8 text-red-500 mb-1" />
              <span className="text-xs font-medium bg-white/80 dark:bg-black/80 px-1.5 py-0.5 rounded">Restaurant</span>
            </div>

            {/* User Location */}
            <div className="absolute top-[50%] left-[85%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
              <Home className="h-8 w-8 text-green-500 mb-1" />
              <span className="text-xs font-medium bg-white/80 dark:bg-black/80 px-1.5 py-0.5 rounded">You</span>
            </div>

            {/* Delivery Agent Location - Animated or Positioned based on status */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center transition-all duration-1000 ease-in-out"
              style={{ top: agentPosition.top, left: agentPosition.left }}
            >
              <Bike className="h-8 w-8 text-blue-500 mb-1 animate-pulse" />
              <span className="text-xs font-medium bg-white/80 dark:bg-black/80 px-1.5 py-0.5 rounded">
                {deliveryAgentName}
              </span>
            </div>

            {/* Simulated Route Line */}
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 56.25" preserveAspectRatio="none">
              {/* Line from Restaurant to Agent */}
              <line
                x1="15"
                y1="28.125" // 50% of 56.25 (aspect ratio height)
                x2={parseFloat(agentPosition.left)}
                y2={parseFloat(agentPosition.top)} // Simplified, assumes agent y is same as user/restaurant
                stroke="rgba(0, 0, 255, 0.5)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              {/* Line from Agent to User */}
               <line
                x1={parseFloat(agentPosition.left)}
                y1={parseFloat(agentPosition.top)} // Simplified
                x2="85"
                y2="28.125"
                stroke="rgba(0, 0, 255, 0.3)"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            </svg>

            <div className="absolute bottom-2 right-2 flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <Route className="h-3 w-3"/>
              <span>Simulated Route</span>
            </div>
          </div>
        </AspectRatio>
        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
          This is a visual representation of your order's journey. Actual map features are illustrative.
        </p>
      </CardContent>
    </Card>
  );
};

export default OrderTrackerMap;