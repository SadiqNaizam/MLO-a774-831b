import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea'; // For address form potentially

import { UserCircle, MapPin, CreditCard, ListOrdered, Bell, HelpCircle, Edit2, PlusCircle, Trash2 } from 'lucide-react';

// Placeholder data
const user = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '555-0101',
  avatarUrl: 'https://i.pravatar.cc/150?u=alexjohnson', // Placeholder avatar
  initials: 'AJ',
};

const addresses = [
  { id: '1', type: 'Home', line1: '123 Willow Lane', city: 'Springfield', state: 'IL', zip: '62704', isDefault: true },
  { id: '2', type: 'Work', line1: '456 Oak Street, Suite 300', city: 'Springfield', state: 'IL', zip: '62701', isDefault: false },
];

const paymentMethods = [
  { id: 'pm_1', type: 'Visa', last4: '4242', expiry: '12/2025' },
  { id: 'pm_2', type: 'Mastercard', last4: '5555', expiry: '08/2026' },
];

const orderHistory = [
  { id: 'ORDER789', date: '2024-07-15', total: 35.99, status: 'Delivered', items: 3, restaurant: 'Pizza Place' },
  { id: 'ORDER790', date: '2024-07-10', total: 22.50, status: 'Delivered', items: 2, restaurant: 'Sushi Central' },
  { id: 'ORDER791', date: '2024-07-02', total: 18.75, status: 'Cancelled', items: 1, restaurant: 'Burger Joint' },
];

const UserProfilePage = () => {
  console.log('UserProfilePage loaded');

  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userPhone, setUserPhone] = useState(user.phone);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile, addresses, payments, and more.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-6">
            <TabsTrigger value="profile"><UserCircle className="mr-2 h-4 w-4 inline-block" />Profile</TabsTrigger>
            <TabsTrigger value="addresses"><MapPin className="mr-2 h-4 w-4 inline-block" />Addresses</TabsTrigger>
            <TabsTrigger value="payment"><CreditCard className="mr-2 h-4 w-4 inline-block" />Payment</TabsTrigger>
            <TabsTrigger value="orders"><ListOrdered className="mr-2 h-4 w-4 inline-block" />Orders</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4 inline-block" />Notifications</TabsTrigger>
            <TabsTrigger value="help"><HelpCircle className="mr-2 h-4 w-4 inline-block" />Help</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Edit2 className="mr-2 h-3 w-3" /> Change Photo
                  </Button>
                </div>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Delivery Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Delivery Addresses</CardTitle>
                  <CardDescription>Manage your saved delivery locations.</CardDescription>
                </div>
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.map((addr) => (
                  <Card key={addr.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-md">{addr.type} {addr.isDefault && <span className="text-xs text-primary font-normal ml-1">(Default)</span>}</h3>
                        <p className="text-sm text-muted-foreground">{addr.line1}</p>
                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {!addr.isDefault && (
                       <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-xs">Set as default</Button>
                    )}
                  </Card>
                ))}
                {addresses.length === 0 && <p className="text-muted-foreground text-sm">No addresses saved yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your saved payment options.</CardDescription>
                </div>
                 <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Payment Method
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((pm) => (
                  <Card key={pm.id} className="p-4">
                     <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-md">{pm.type} ending in {pm.last4}</h3>
                          <p className="text-sm text-muted-foreground">Expires: {pm.expiry}</p>
                        </div>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                     </div>
                  </Card>
                ))}
                {paymentMethods.length === 0 && <p className="text-muted-foreground text-sm">No payment methods saved yet.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View your past orders and their status.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderHistory.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.restaurant}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/order-tracking?orderId=${order.id}`}>View Details</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                     {orderHistory.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">You haven't placed any orders yet.</TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Preferences Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive updates from us.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive updates about your orders and promotions via email.</p>
                        </div>
                        <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Get real-time alerts on your mobile device.</p>
                        </div>
                        <Switch
                            id="push-notifications"
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <Label htmlFor="sms-notifications" className="font-medium">SMS Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive critical order updates via text message.</p>
                        </div>
                        <Switch
                            id="sms-notifications"
                            checked={smsNotifications}
                            onCheckedChange={setSmsNotifications}
                        />
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Help & Support Tab */}
          <TabsContent value="help">
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>Find answers to your questions or contact us.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Frequently Asked Questions (FAQ)</h3>
                  <p className="text-sm text-muted-foreground">Browse our FAQ section for common queries.</p>
                  <Button variant="link" className="p-0 h-auto mt-1" asChild>
                    <a href="/faq-placeholder" target="_blank" rel="noopener noreferrer">Go to FAQ</a>
                  </Button>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">Can't find what you're looking for? Our support team is here to help.</p>
                  <p className="text-sm mt-1">Email: <a href="mailto:support@foodieapp.com" className="text-primary hover:underline">support@foodieapp.com</a></p>
                  <p className="text-sm">Phone: <a href="tel:+1800555FOOD" className="text-primary hover:underline">1-800-555-FOOD</a> (Mon-Fri, 9am-6pm)</p>
                </div>
                 <Separator />
                <div>
                  <h3 className="font-semibold">Terms of Service & Privacy Policy</h3>
                   <Button variant="link" className="p-0 h-auto mt-1 mr-4" asChild>
                    <a href="/terms-placeholder" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                  </Button>
                   <Button variant="link" className="p-0 h-auto mt-1" asChild>
                    <a href="/privacy-placeholder" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;