
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

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

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const linkClasses = (path: string) => {
    return `text-foreground transition-colors ${
      isActiveRoute(path)
        ? "text-primary font-medium"
        : "hover:text-primary"
    }`;
  };

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
            <Link to="/" className={linkClasses("/")}>
              Home
            </Link>
            <Link to="/products" className={linkClasses("/products")}>
              Products
            </Link>
            <Link to="/categories" className={linkClasses("/categories")}>
              Categories
            </Link>
            <Link to="/about" className={linkClasses("/about")}>
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
              <Button 
                variant="ghost" 
                size="icon" 
                className={`text-foreground ${isActiveRoute("/wishlist") ? "bg-accent" : ""}`}
              >
                <HeartIcon size={20} />
              </Button>
            </Link>
          )}

          {/* User Profile - Desktop only */}
          {!isMobile && (
            <Link to="/profile">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`text-foreground ${isActiveRoute("/profile") ? "bg-accent" : ""}`}
              >
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
                  <Link to="/" className={`px-2 py-2 rounded-md transition-colors ${linkClasses("/")}`}>
                    Home
                  </Link>
                  <Link to="/products" className={`px-2 py-2 rounded-md transition-colors ${linkClasses("/products")}`}>
                    Products
                  </Link>
                  <Link to="/categories" className={`px-2 py-2 rounded-md transition-colors ${linkClasses("/categories")}`}>
                    Categories
                  </Link>
                  <Link to="/wishlist" className={`px-2 py-2 rounded-md transition-colors ${linkClasses("/wishlist")}`}>
                    Wishlist
                  </Link>
                  <Link to="/profile" className={`px-2 py-2 rounded-md transition-colors ${linkClasses("/profile")}`}>
                    My Account
                  </Link>
                  <Link to="/about" className={`px-2 py-2 rounded-md transition-colors ${linkClasses("/about")}`}>
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

