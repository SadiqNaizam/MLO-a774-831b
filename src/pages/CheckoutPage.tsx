import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";
import { MapPin, CreditCard, Tag, ShoppingBag, Trash2 } from 'lucide-react';

const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const checkoutFormSchema = z.object({
  addressType: z.enum(["saved", "new"], { required_error: "Please select an address option." }),
  savedAddressId: z.string().optional(),
  newAddressStreet: z.string().optional(),
  newAddressCity: z.string().optional(),
  newAddressState: z.string().optional(),
  newAddressZip: z.string().optional(),
  paymentMethod: z.enum(["creditCard", "paypal", "cash"], { required_error: "Please select a payment method." }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  promoCode: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.addressType === "new") {
    if (!data.newAddressStreet || data.newAddressStreet.trim() === "") {
      ctx.addIssue({ path: ["newAddressStreet"], message: "Street is required for new address.", code: z.ZodIssueCode.custom });
    }
    if (!data.newAddressCity || data.newAddressCity.trim() === "") {
      ctx.addIssue({ path: ["newAddressCity"], message: "City is required for new address.", code: z.ZodIssueCode.custom });
    }
    if (!data.newAddressState || data.newAddressState.trim() === "") {
      ctx.addIssue({ path: ["newAddressState"], message: "State is required for new address.", code: z.ZodIssueCode.custom });
    }
    if (!data.newAddressZip || !/^\d{5}(-\d{4})?$/.test(data.newAddressZip)) {
      ctx.addIssue({ path: ["newAddressZip"], message: "Valid ZIP code is required.", code: z.ZodIssueCode.custom });
    }
  }
  if (data.addressType === "saved" && (!data.savedAddressId || data.savedAddressId.trim() === "")) {
     ctx.addIssue({ path: ["savedAddressId"], message: "Please select a saved address.", code: z.ZodIssueCode.custom });
  }

  if (data.paymentMethod === "creditCard") {
    if (!data.cardNumber || !/^\d{16}$/.test(data.cardNumber)) {
      ctx.addIssue({ path: ["cardNumber"], message: "Valid 16-digit card number is required.", code: z.ZodIssueCode.custom });
    }
    if (!data.cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry)) {
      ctx.addIssue({ path: ["cardExpiry"], message: "Valid MM/YY expiry date is required.", code: z.ZodIssueCode.custom });
    }
    if (!data.cardCvv || !/^\d{3,4}$/.test(data.cardCvv)) {
      ctx.addIssue({ path: ["cardCvv"], message: "Valid 3 or 4 digit CVV is required.", code: z.ZodIssueCode.custom });
    }
  }
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 'item1', name: 'Margherita Pizza', price: 12.99, quantity: 1, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60' },
    { id: 'item2', name: 'Coca-Cola Can', price: 1.99, quantity: 2, image: 'https://images.unsplash.com/photo-1554866585-CD94860890b7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60' },
    { id: 'item3', name: 'Garlic Bread Sticks', price: 5.49, quantity: 1, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60' },
  ]);

  const savedAddresses = [
    { id: 'addr1', street: '123 Main St', city: 'Foodville', state: 'CA', zip: '90210', label: 'Home - 123 Main St, Foodville, CA' },
    { id: 'addr2', street: '456 Oak Ave', city: 'Tastytown', state: 'NY', zip: '10001', label: 'Work - 456 Oak Ave, Tastytown, NY' },
  ];

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      addressType: "saved",
      savedAddressId: savedAddresses.length > 0 ? savedAddresses[0].id : undefined,
      newAddressStreet: "",
      newAddressCity: "",
      newAddressState: "",
      newAddressZip: "",
      paymentMethod: "creditCard",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
      promoCode: "",
    },
  });

  const addressType = form.watch("addressType");
  const paymentMethod = form.watch("paymentMethod");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 5.00; // Example fee
  const [discount, setDiscount] = useState(0); // Example discount
  const total = subtotal + deliveryFee - discount;

  const onSubmit = (data: CheckoutFormValues) => {
    console.log('Checkout form submitted:', data);
    toast.success("Order Placed Successfully!", {
      description: "Your delicious meal is on its way. Redirecting to order tracking...",
    });
    // Simulate API call and then redirect
    setTimeout(() => {
      navigate('/order-tracking'); // Path from App.tsx
    }, 2000);
  };
  
  const handleApplyPromo = () => {
    const code = form.getValues("promoCode");
    if (code?.toLowerCase() === "YUMMY10") {
      setDiscount(subtotal * 0.10);
      toast.success("Promo code YUMMY10 applied!", { description: "You get 10% off." });
    } else if (code && code.trim() !== "") {
      toast.error("Invalid promo code.", { description: "Please try another one." });
    } else {
      toast.info("No promo code entered.");
    }
  };

  useEffect(() => {
    console.log('CheckoutPage loaded');
  }, []);
  
  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast.info("Item removed from cart.");
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">Checkout</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Address, Payment, Promo */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" /> Delivery Address</CardTitle>
                  <CardDescription>Choose where you'd like your order delivered.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="addressType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="saved" />
                              </FormControl>
                              <FormLabel className="font-normal">Use a saved address</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="new" />
                              </FormControl>
                              <FormLabel className="font-normal">Add a new address</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {addressType === "saved" && (
                    <FormField
                      control={form.control}
                      name="savedAddressId"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Select Address</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a saved address" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {savedAddresses.map(addr => (
                                <SelectItem key={addr.id} value={addr.id}>{addr.label}</SelectItem>
                              ))}
                              {savedAddresses.length === 0 && <SelectItem value="no-address" disabled>No saved addresses</SelectItem>}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {addressType === "new" && (
                    <div className="mt-4 space-y-4">
                      <FormField control={form.control} name="newAddressStreet" render={({ field }) => ( <FormItem> <FormLabel>Street Address</FormLabel> <FormControl><Input placeholder="123 Main St" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField control={form.control} name="newAddressCity" render={({ field }) => ( <FormItem> <FormLabel>City</FormLabel> <FormControl><Input placeholder="Anytown" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="newAddressState" render={({ field }) => ( <FormItem> <FormLabel>State</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger></FormControl> <SelectContent> {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)} </SelectContent> </Select> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="newAddressZip" render={({ field }) => ( <FormItem> <FormLabel>ZIP Code</FormLabel> <FormControl><Input placeholder="90210" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary" /> Payment Method</CardTitle>
                   <CardDescription>Choose how you'd like to pay for your order.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="creditCard" /></FormControl> <FormLabel className="font-normal">Credit/Debit Card</FormLabel> </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="paypal" /></FormControl> <FormLabel className="font-normal">PayPal</FormLabel> </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="cash" /></FormControl> <FormLabel className="font-normal">Cash on Delivery</FormLabel> </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {paymentMethod === "creditCard" && (
                    <div className="mt-4 space-y-4">
                      <FormField control={form.control} name="cardNumber" render={({ field }) => ( <FormItem> <FormLabel>Card Number</FormLabel> <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="cardExpiry" render={({ field }) => ( <FormItem> <FormLabel>Expiry Date</FormLabel> <FormControl><Input placeholder="MM/YY" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={form.control} name="cardCvv" render={({ field }) => ( <FormItem> <FormLabel>CVV</FormLabel> <FormControl><Input placeholder="•••" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                      </div>
                    </div>
                  )}
                   {paymentMethod === "paypal" && <p className="mt-4 text-sm text-muted-foreground">You will be redirected to PayPal to complete your payment.</p>}
                   {paymentMethod === "cash" && <p className="mt-4 text-sm text-muted-foreground">Please have exact change ready for the delivery driver.</p>}
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Tag className="mr-2 h-5 w-5 text-primary" /> Promo Code</CardTitle>
                  <CardDescription>Have a discount code? Enter it here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <FormField control={form.control} name="promoCode" render={({ field }) => ( <FormItem className="flex-grow"> <FormControl><Input placeholder="Enter promo code" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <Button type="button" variant="outline" onClick={handleApplyPromo}>Apply</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="sticky top-24"> {/* Sticky for long forms */}
                <CardHeader>
                  <CardTitle className="flex items-center"><ShoppingBag className="mr-2 h-5 w-5 text-primary" /> Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-muted-foreground text-center">Your cart is empty.</p>
                  ) : (
                    cartItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                         <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                         <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                         </Button>
                        </div>
                      </div>
                    ))
                  )}
                  {cartItems.length > 0 && <Separator />}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-sm text-green-600 dark:text-green-400"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" size="lg" disabled={cartItems.length === 0 || form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Placing Order..." : "Place Order"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;