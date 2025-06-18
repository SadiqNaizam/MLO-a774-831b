import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description?: string; // Optional description
}

const initialCartItems: CartItem[] = [
  {
    id: 'dish1',
    name: 'Spicy Pepperoni Pizza',
    price: 15.99,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    description: 'Classic pepperoni pizza with a spicy kick.'
  },
  {
    id: 'dish2',
    name: 'Chicken Caesar Salad',
    price: 10.50,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    description: 'Fresh salad with grilled chicken and Caesar dressing.'
  },
  {
    id: 'dish3',
    name: 'Chocolate Lava Cake',
    price: 7.25,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1506068270147-aa9c0fc01353?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    description: 'Warm chocolate cake with a molten center.'
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CartPage loaded');
  }, []);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Optionally remove item if quantity is less than 1, or just cap at 1
      // For this example, we cap at 1. Use removeItem for explicit removal.
      newQuantity = 1;
    }
    setCartItems(items =>
      items.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example fixed delivery fee
  const taxes = cartItems.length > 0 ? subtotal * 0.08 : 0; // Example 8% tax rate
  const total = subtotal + deliveryFee + taxes;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center">
              <ShoppingBag className="w-16 h-16 text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Your cart is empty!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button asChild size="lg">
                <Link to="/restaurant-listing">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Cart Items Section */}
            <section className="md:col-span-2 space-y-6">
              {cartItems.map(item => (
                <Card key={item.id} className="overflow-hidden shadow-sm dark:bg-gray-800">
                  <div className="flex items-center p-4 gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md border dark:border-gray-700"
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
                      <p className="text-sm text-primary font-medium">${item.price.toFixed(2)}</p>
                      {item.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">{item.description}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-auto">
                       <div className="flex items-center border rounded-md dark:border-gray-700">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          className="h-8 w-12 text-center border-l border-r rounded-none dark:bg-gray-800 dark:text-gray-100"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                       <p className="text-md font-semibold text-gray-800 dark:text-gray-100 mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 dark:hover:text-red-400 p-0 h-auto"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </section>

            {/* Order Summary Section */}
            <aside className="md:col-span-1 sticky top-24"> {/* Sticky for desktop */}
              <Card className="shadow-lg dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Taxes (Est.)</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <Separator className="dark:bg-gray-700"/>
                  <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-gray-100">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="specialInstructions" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Special Instructions
                    </label>
                    <Textarea
                      id="specialInstructions"
                      placeholder="Any special requests for your order? (e.g., no onions)"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="min-h-[80px] dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => navigate('/checkout')} // Route from App.tsx
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;