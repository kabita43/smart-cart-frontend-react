
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { addToCart } from "@/store/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice";
import { Product } from "@/store/productSlice";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  StarIcon, 
  ShoppingBagIcon 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    }));
    
    toast({
      title: "Added to Cart",
      description: `${product.title.substring(0, 20)}... was added to your cart`,
    });
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast({
        title: "Removed from Wishlist",
        description: `${product.title.substring(0, 20)}... was removed from your wishlist`,
        variant: "destructive",
      });
    } else {
      dispatch(addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      }));
      toast({
        title: "Added to Wishlist",
        description: `${product.title.substring(0, 20)}... was added to your wishlist`,
      });
    }
  };

  // Generate stars based on rating
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`star-${i}`} size={16} className="fill-yellow-400 text-yellow-400" />);
    }
    
    if (halfStar) {
      stars.push(<StarIcon key="half-star" size={16} className="text-yellow-400" />);
    }
    
    return stars;
  };

  return (
    <div 
      className="group bg-background border rounded-xl shadow-sm overflow-hidden product-card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pt-[100%] bg-muted/30">
        {/* Product Image */}
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {/* Wishlist Button */}
        <Button 
          size="icon" 
          variant="secondary" 
          className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-70 hover:opacity-100"
          onClick={handleWishlist}
        >
          <HeartIcon 
            size={16} 
            className={isInWishlist ? "fill-red-500 text-red-500" : ""} 
          />
        </Button>
        
        {/* Quick Add buttons that appear on hover */}
        <div className={`absolute inset-x-0 bottom-0 flex justify-center space-x-2 p-3 bg-gradient-to-t from-background/80 to-transparent transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-background"
            onClick={handleAddToCart}
          >
            <ShoppingCartIcon size={16} className="mr-1" />
            Add to Cart
          </Button>
          <Link to={`/product/${product.id}`} className="flex-1">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full"
            >
              <ShoppingBagIcon size={16} className="mr-1" />
              View Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-muted-foreground capitalize mb-1">
          {product.category}
        </p>
        
        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium line-clamp-2 h-12 mb-1 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          
          {/* Rating stars */}
          <div className="flex items-center">
            <div className="flex">
              {renderRatingStars(product.rating.rate)}
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              ({product.rating.count})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
