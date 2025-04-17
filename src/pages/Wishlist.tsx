
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/use-redux";
import { removeFromWishlist, clearWishlist } from "@/store/wishlistSlice";
import { addToCart } from "@/store/cartSlice";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Button } from "@/components/ui/button";
import { TrashIcon, ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Wishlist() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromWishlist(id));
    toast.success("Item removed from wishlist");
  };

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      id: item.id,
      title: item.title, 
      price: item.price,
      image: item.image
    }));
    dispatch(removeFromWishlist(item.id));
    toast.success("Item moved to cart");
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
    setIsDialogOpen(false);
    toast.success("Wishlist cleared");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">My Wishlist</h1>
            {wishlistItems.length > 0 && (
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Clear Wishlist
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear your wishlist?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently remove all items from your wishlist.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearWishlist} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Clear
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block p-6 rounded-full bg-muted/50 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Items added to your wishlist will appear here.
              </p>
              <Button asChild>
                <Link to="/products">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden group">
                  <div className="aspect-square bg-muted/50 p-4 relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                    
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove from wishlist"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <Link to={`/product/${item.id}`} className="block">
                      <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    
                    <div className="mt-2 mb-4">
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                    
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full"
                      size="sm"
                    >
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
