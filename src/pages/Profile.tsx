
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState } from "react";

// Sample orders data
const orders = [
  {
    id: "#ORD-12345",
    date: "Mar 14, 2023",
    total: 89.99,
    status: "Delivered",
    items: [
      { id: 1, name: "Wireless Headphones", price: 89.99, quantity: 1 }
    ]
  },
  {
    id: "#ORD-12346",
    date: "Feb 28, 2023",
    total: 124.97,
    status: "Delivered",
    items: [
      { id: 2, name: "Smart Watch", price: 99.99, quantity: 1 },
      { id: 3, name: "Phone Case", price: 24.98, quantity: 1 }
    ]
  },
  {
    id: "#ORD-12347",
    date: "Jan 15, 2023",
    total: 49.99,
    status: "Delivered",
    items: [
      { id: 4, name: "Bluetooth Speaker", price: 49.99, quantity: 1 }
    ]
  }
];

export default function Profile() {
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States"
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile information updated successfully");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (password.new.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    toast.success("Password changed successfully");
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* User Info Card */}
          <Card className="w-full md:w-72 sticky top-20">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://randomuser.me/api/portraits/men/42.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{userInfo.name}</CardTitle>
                  <CardDescription>{userInfo.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Member since January 2023
              </p>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="orders">Order History</TabsTrigger>
                <TabsTrigger value="account">Account Settings</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              {/* Orders Tab */}
              <TabsContent value="orders">
                <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
                
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{order.id}</CardTitle>
                              <CardDescription>{order.date}</CardDescription>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                                {order.status}
                              </span>
                              <p className="mt-1 font-medium">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <ul className="divide-y">
                            {order.items.map((item) => (
                              <li key={item.id} className="py-3 flex justify-between">
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <p>${item.price.toFixed(2)}</p>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button variant="ghost" size="sm">Track Order</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">
                      When you place orders, they will appear here.
                    </p>
                    <Button asChild>
                      <a href="/products">Start Shopping</a>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Account Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your account information here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleInfoSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            value={userInfo.address}
                            onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            value={userInfo.city}
                            onChange={(e) => setUserInfo({...userInfo, city: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input 
                              id="state" 
                              value={userInfo.state}
                              onChange={(e) => setUserInfo({...userInfo, state: e.target.value})}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="zip">Zip Code</Label>
                            <Input 
                              id="zip" 
                              value={userInfo.zip}
                              onChange={(e) => setUserInfo({...userInfo, zip: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input 
                            id="country" 
                            value={userInfo.country}
                            onChange={(e) => setUserInfo({...userInfo, country: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="mt-6">Save Changes</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password here. After saving, you'll be logged out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input 
                            id="current-password" 
                            type="password" 
                            value={password.current}
                            onChange={(e) => setPassword({...password, current: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input 
                            id="new-password" 
                            type="password" 
                            value={password.new}
                            onChange={(e) => setPassword({...password, new: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input 
                            id="confirm-password" 
                            type="password" 
                            value={password.confirm}
                            onChange={(e) => setPassword({...password, confirm: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="mt-6">Update Password</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
