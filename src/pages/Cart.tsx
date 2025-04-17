
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/use-redux";
import { removeFromCart, updateQuantity, clearCart } from "@/store/cartSlice";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function Cart() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  
  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );
  const shipping = subtotal > 0 ? 4.99 : 0;
  const discount = 0; // Can be calculated based on coupon code
  const total = subtotal + shipping - discount;
  
  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
  };
  
  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared");
  };
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error("Coupon code not valid");
    // Would validate and apply coupon here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block p-8 rounded-full bg-muted/50 mb-6">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. 
                Browse our products and find something you'll love!
              </p>
              <Button asChild size="lg">
                <Link to="/products">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg shadow-sm divide-y">
                  {/* Cart Header */}
                  <div className="px-6 py-4 flex justify-between items-center">
                    <h2 className="font-semibold">
                      {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleClearCart}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cart
                    </Button>
                  </div>
                  
                  {/* Cart Items */}
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="h-24 w-24 rounded bg-muted/50 p-2 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <Link 
                              to={`/product/${item.id}`}
                              className="font-medium hover:text-primary transition-colors line-clamp-2"
                            >
                              {item.title}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              Unit Price: ${item.price.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center border rounded">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <span className="w-10 text-center text-sm">
                                {item.quantity}
                              </span>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-none"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <p className="font-semibold whitespace-nowrap">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Continue Shopping */}
                  <div className="p-6">
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                      <Link to="/products">
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-card rounded-lg shadow-sm p-6 space-y-6">
                  <h2 className="font-semibold text-lg">Order Summary</h2>
                  
                  {/* Coupon Code */}
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <Input placeholder="Coupon Code" className="flex-1" />
                      <Button type="submit" variant="outline">Apply</Button>
                    </form>
                  </div>
                  
                  {/* Summary Items */}
                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount</span>
                        <span className="text-green-600">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <Button asChild className="w-full">
                    <Link to="/checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>
                  
                  {/* Accepted Payment Methods */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">We Accept:</p>
                    <div className="flex gap-2">
                      <div className="bg-muted/50 p-1 rounded h-8 w-12"></div>
                      <div className="bg-muted/50 p-1 rounded h-8 w-12"></div>
                      <div className="bg-muted/50 p-1 rounded h-8 w-12"></div>
                      <div className="bg-muted/50 p-1 rounded h-8 w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
