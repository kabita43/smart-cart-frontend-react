
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { addToCart } from "@/store/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { 
  Button,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
} from "@/components/ui";
import { 
  ShoppingCart, 
  Heart,
  ChevronRight, 
  Truck, 
  RefreshCw,
  ShieldCheck,
  Star,
  Minus,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/store/productSlice";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { items: products, status } = useAppSelector((state) => state.products);
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Check if product is in wishlist
  const isInWishlist = wishlistItems.some(item => item.id === Number(id));
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // First check if we already have the product in state
        const existingProduct = products.find(p => p.id === Number(id));
        
        if (existingProduct) {
          setProduct(existingProduct);
        } else {
          // Fetch from API if not available
          const response = await fetch(`https://fakestoreapi.com/products/${id}`);
          if (!response.ok) throw new Error('Failed to fetch product');
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, products, toast]);
  
  // Set selected image when product is loaded
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      }));
      
      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`,
      });
    }
  };
  
  // Handle wishlist
  const handleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast({
        title: "Removed from wishlist",
        description: "Product removed from your wishlist",
      });
    } else {
      dispatch(addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      }));
      toast({
        title: "Added to wishlist",
        description: "Product added to your wishlist",
      });
    }
  };
  
  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Render loading skeletons
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 space-y-4">
              <Skeleton className="aspect-square w-full" />
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="w-20 h-20" />
                ))}
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    );
  }
  
  // Render error state if no product found
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    );
  }
  
  // Generate stars based on rating
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} size={16} className="fill-yellow-400 text-yellow-400" />);
    }
    
    if (halfStar) {
      stars.push(<Star key="half-star" size={16} className="text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} size={16} className="text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="text-foreground">{product.title}</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Images */}
            <div className="md:w-1/2 space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center overflow-hidden">
                <img 
                  src={selectedImage || product.image} 
                  alt={product.title}
                  className="max-h-[400px] object-contain mx-auto"
                />
              </div>
              
              {/* Thumbnail images (just showing the same image multiple times for demo) */}
              <div className="flex justify-center gap-3">
                {[product.image, product.image, product.image].map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 border rounded-lg overflow-hidden p-2 ${
                      selectedImage === img ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img src={img} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="md:w-1/2 space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {renderRatingStars(product.rating.rate)}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              </div>
              
              {/* Price */}
              <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
              
              {/* Description */}
              <p className="text-muted-foreground">{product.description}</p>
              
              {/* Quantity Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-none"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-none"
                    onClick={increaseQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 min-w-[150px]"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button 
                  variant={isInWishlist ? "destructive" : "outline"} 
                  size="lg"
                  className="min-w-[50px]"
                  onClick={handleWishlist}
                >
                  <Heart 
                    className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} 
                  />
                </Button>
              </div>
              
              {/* Shipping & Returns */}
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">For orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Easy Returns</p>
                    <p className="text-xs text-muted-foreground">30 day return policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Secure Checkout</p>
                    <p className="text-xs text-muted-foreground">SSL Encrypted Checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-4">
                <p className="leading-relaxed">
                  {product.description}
                </p>
                <p className="mt-4 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </TabsContent>
              <TabsContent value="details" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Product Specifications</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <span>{product.category}</span>
                      </li>
                      <Separator />
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Rating</span>
                        <span>{product.rating.rate} / 5</span>
                      </li>
                      <Separator />
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Reviews</span>
                        <span>{product.rating.count}</span>
                      </li>
                      <Separator />
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">SKU</span>
                        <span>PRD-{product.id}-{product.category.substring(0, 3).toUpperCase()}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span>3-5 business days</span>
                      </li>
                      <Separator />
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Free Shipping</span>
                        <span>Orders over $50</span>
                      </li>
                      <Separator />
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Returns</span>
                        <span>30 day policy</span>
                      </li>
                      <Separator />
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Warranty</span>
                        <span>1 Year limited</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-4">
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">Customer Reviews</h3>
                  <div className="flex justify-center my-4">
                    <div className="flex">
                      {renderRatingStars(product.rating.rate)}
                    </div>
                    <span className="text-lg font-medium ml-2">{product.rating.rate}/5</span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Based on {product.rating.count} reviews
                  </p>
                  <Button>Write a Review</Button>
                </div>
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
