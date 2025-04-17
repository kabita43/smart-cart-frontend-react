
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Button } from "@/components/ui/button";
import { ShoppingBagIcon, HomeIcon, SearchIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-16 text-center">
          <div className="animate-bounce mb-6">
            <ShoppingBagIcon className="h-16 w-16 mx-auto text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-8">
            Oops! The page you are looking for doesn't exist or might have been moved.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link to="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link to="/products">
                <SearchIcon className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
      <CartDrawer />
    </div>
  );
}
