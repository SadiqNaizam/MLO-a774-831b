import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OrderTrackerMap from '@/components/OrderTrackerMap';

// shadcn/ui Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

// Lucide Icons
import {
  ClipboardCheck,
  Store,
  ChefHat,
  Bike,
  PackageCheck,
  MessageCircle,
  HomeIcon as LucideHomeIcon, // Renamed to avoid conflict if HTML HomeIcon is ever used
} from 'lucide-react';

interface OrderStatus {
  id: number;
  title: string;
  timestamp: string | null;
  icon: React.ReactNode;
  mapStatus: 'preparing' | 'picked-up' | 'en-route' | 'arriving-soon' | 'delivered';
  progressValue: number;
  estimatedTime: string;
  completed: boolean;
  isCurrent: boolean;
}

const initialStatuses: OrderStatus[] = [
  { id: 1, title: "Order Placed", timestamp: null, icon: <ClipboardCheck className="h-4 w-4" />, mapStatus: 'preparing', progressValue: 10, estimatedTime: "Est. 10:30 AM", completed: false, isCurrent: false },
  { id: 2, title: "Restaurant Confirmed", timestamp: null, icon: <Store className="h-4 w-4" />, mapStatus: 'preparing', progressValue: 25, estimatedTime: "Est. 10:35 AM", completed: false, isCurrent: false },
  { id: 3, title: "Preparing Your Meal", timestamp: null, icon: <ChefHat className="h-4 w-4" />, mapStatus: 'preparing', progressValue: 50, estimatedTime: "Est. 10:45 AM", completed: false, isCurrent: false },
  { id: 4, title: "Out for Delivery", timestamp: null, icon: <Bike className="h-4 w-4" />, mapStatus: 'en-route', progressValue: 75, estimatedTime: "Est. 11:00 AM", completed: false, isCurrent: false },
  { id: 5, title: "Delivered", timestamp: null, icon: <PackageCheck className="h-4 w-4" />, mapStatus: 'delivered', progressValue: 100, estimatedTime: "Delivered 11:15 AM", completed: false, isCurrent: false },
];

const OrderTrackingPage: React.FC = () => {
  console.log('OrderTrackingPage loaded');

  const [orderId] = useState(`FOODIE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
  const [statusHistory, setStatusHistory] = useState<OrderStatus[]>(initialStatuses.map(s => ({...s}))); // Deep copy initial statuses
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  useEffect(() => {
    // Set the first status as current immediately
    setStatusHistory(prev => prev.map((status, idx) =>
      idx === 0 ? { ...status, isCurrent: true, completed: false, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : status
    ));

    const interval = setInterval(() => {
      setCurrentStatusIndex(prevIdx => {
        const nextIdx = prevIdx + 1;
        if (nextIdx < statusHistory.length) {
          setStatusHistory(prev =>
            prev.map((status, idx) => {
              if (idx < nextIdx) {
                return { ...status, completed: true, isCurrent: false, timestamp: status.timestamp || new Date(Date.now() - (nextIdx - idx) * 2 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
              }
              if (idx === nextIdx) {
                return { ...status, completed: false, isCurrent: true, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
              }
              return status;
            })
          );
          return nextIdx;
        } else {
          // All statuses completed, mark the last one as completed and current
          setStatusHistory(prev =>
            prev.map((status, idx) =>
              idx === prev.length - 1 ? { ...status, completed: true, isCurrent: true } : {...status, completed: true, isCurrent: false}
            )
          );
          clearInterval(interval);
          return prevIdx;
        }
      });
    }, 7000); // Update status every 7 seconds for demonstration

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const activeStatus = statusHistory[currentStatusIndex] || statusHistory[statusHistory.length - 1] || initialStatuses[0];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="bg-muted/30 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-primary">Track Your Order</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Order ID: <span className="font-semibold text-gray-700 dark:text-gray-300">{orderId}</span>
                </CardDescription>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="text-lg font-semibold text-primary">{activeStatus.estimatedTime}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-6 md:space-y-8">
            <OrderTrackerMap
              userAddress="123 Home Street, Your City"
              restaurantAddress="The Food Place"
              deliveryAgentName="Rider Alex"
              deliveryStatus={activeStatus.mapStatus}
              estimatedTimeOfArrival={activeStatus.estimatedTime}
            />

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Status: <span className={`font-semibold ${activeStatus.isCurrent ? 'text-primary' : 'text-gray-800 dark:text-gray-200'}`}>{activeStatus.title}</span>
                </p>
                {activeStatus.progressValue < 100 && (
                  <p className="text-xs text-muted-foreground animate-pulse">Updating...</p>
                )}
              </div>
              <Progress value={activeStatus.progressValue} className="w-full h-2.5" />
            </div>

            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Order Timeline</h3>
              <div className="relative pl-8 pt-2"> {/* Increased padding-top for better spacing */}
                <div className="absolute left-[15px] top-2 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2"></div>
                {statusHistory.map((step) => (
                  <div key={step.id} className="flex items-start space-x-4 mb-5 relative">
                    <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0
                      ${step.isCurrent ? 'border-primary bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background dark:ring-offset-gray-900 animate-pulse' :
                        step.completed ? 'border-green-500 bg-green-500 text-white' :
                        'border-gray-300 bg-gray-100 dark:bg-gray-600 dark:border-gray-500 text-gray-500 dark:text-gray-400'}`}>
                      {step.icon}
                    </div>
                    <div className={`pb-2 w-full ${!statusHistory.find(s => s.id === step.id +1) ? '' : 'border-b border-dashed border-gray-200 dark:border-gray-700'}`}>
                      <p className={`font-semibold text-sm md:text-base
                        ${step.isCurrent ? 'text-primary' :
                          step.completed ? 'text-gray-900 dark:text-gray-100' :
                          'text-gray-600 dark:text-gray-400'}`}>
                        {step.title}
                      </p>
                      <p className={`text-xs
                        ${step.completed || step.isCurrent ? 'text-muted-foreground' :
                        'text-gray-400 dark:text-gray-500'}`}>
                        {step.timestamp || (step.isCurrent ? "Processing..." : "Pending")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" className="w-full sm:flex-1">
                <MessageCircle className="mr-2 h-4 w-4" /> Contact Support
              </Button>
              <Link to="/" className="w-full sm:flex-1"> {/* Path from App.tsx */}
                <Button variant="secondary" className="w-full">
                  <LucideHomeIcon className="mr-2 h-4 w-4" /> Back to Homepage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;