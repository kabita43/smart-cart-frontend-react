
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { toggleTheme } from "@/store/themeSlice";
import { toggleCart } from "@/store/cartSlice";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, ShoppingCartIcon, HeartIcon, UserIcon, MenuIcon, SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const cartItems = useAppSelector((state) => state.cart.items);
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);

  // Calculate cart quantity
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-gradient">Smart Cart</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/categories" className="text-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <Button variant="ghost" size="icon" className="text-foreground">
            <SearchIcon size={20} />
          </Button>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => dispatch(toggleTheme())}
            className="text-foreground"
          >
            {isDarkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </Button>

          {/* Wishlist Link - Desktop only */}
          {!isMobile && (
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="text-foreground">
                <HeartIcon size={20} />
              </Button>
            </Link>
          )}

          {/* User Profile - Desktop only */}
          {!isMobile && (
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="text-foreground">
                <UserIcon size={20} />
              </Button>
            </Link>
          )}

          {/* Cart Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-foreground"
            onClick={() => dispatch(toggleCart())}
          >
            <ShoppingCartIcon size={20} />
            {cartQuantity > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-white text-xs">
                {cartQuantity}
              </span>
            )}
          </Button>

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground">
                  <MenuIcon size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[75vw] sm:w-[350px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link to="/" className="text-foreground hover:text-primary px-2 py-2 rounded-md transition-colors">
                    Home
                  </Link>
                  <Link to="/products" className="text-foreground hover:text-primary px-2 py-2 rounded-md transition-colors">
                    Products
                  </Link>
                  <Link to="/categories" className="text-foreground hover:text-primary px-2 py-2 rounded-md transition-colors">
                    Categories
                  </Link>
                  <Link to="/wishlist" className="text-foreground hover:text-primary px-2 py-2 rounded-md transition-colors">
                    Wishlist
                  </Link>
                  <Link to="/profile" className="text-foreground hover:text-primary px-2 py-2 rounded-md transition-colors">
                    My Account
                  </Link>
                  <Link to="/about" className="text-foreground hover:text-primary px-2 py-2 rounded-md transition-colors">
                    About
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
